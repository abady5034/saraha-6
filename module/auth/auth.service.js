import { OAuth2Client } from "google-auth-library";
import {
  BadRequestException,
  compareHash,
  emailEvents,
  generateHash,
  rotateToken,
  generateToken,
  NotFoundException,
  OTP,
  ProviderEnum,
  redis,
} from "../../common/index.js";
import { env } from "../../config/env.service.js";
import { userModel } from "../../database/model/user.model.js";
import crypto from "crypto";

export const signup = async (body, profileImage = null, coverImage = null) => {
  let { uniqueName, firstName, lastName, password, email, age, phoneNumber, gender, role } =
    body;
  let existData = await userModel.findOne({ email });
  if (existData) return BadRequestException({ message: "User Already Exist" });
  let hashedPassword = await generateHash({ plainText: password });
  let url = `https://sara7a/${uniqueName}`
  if (hashedPassword) {
    let userAdded = await userModel.create({
      url,
      firstName,
      lastName,
      password: hashedPassword,
      email,
      age,
      phoneNumber,
      gender,
      role,
      profileImage,
      coverImage,
    });
    if (userAdded) {
      OTP.sendOTP({
        recipients: { to: email },
        purpose: "Verify Account",
        userId: userAdded._id,
      });
      return { message: "User Added", data: userAdded };
    } else return BadRequestException({ message: "Error , User not added" });
  } else return BadRequestException({ message: "Error password" });
};

export const verifyAccount = async ({ email, otp }) => {
  let user = await userModel.findOne({ email });
  if (!user) throw NotFoundException({ message: "Email Not Found" });
  if (user.isVerfied)
    throw BadRequestException({ message: "User Already Verifed" });
  await OTP.confirmOTP({ otp, userId: user._id });
  user.isVerfied = true;
  await user.save();
  return { message: "User Verifed", data: user };
};

export const resendOtp = async ({ email }) => {
  let user = await userModel.findOne({ email });
  if (!user) throw NotFoundException({ message: "Email Not Found" });
  await OTP.sendOTP({ recipients: { to: email }, purpose: "OTP", userId: user._id });
  return { message: "OTP Resend Done" };
};

export const twoStepVerification = async ({ email }) => {
  let user = await userModel.findOne({ email });
  if (!user) throw NotFoundException({ message: "Email Not Found" });
  if (user.twoStepVerification)
    throw BadRequestException({ message: "2-Step Verification Active" });
  await OTP.sendOTP({ recipients: { to: email }, purpose: "2-Step Verification", userId: user._id, });
  return { message: "OTP Send Done" };
};

export const verifyTwoStepVerification = async ({ email, otp }) => {
  let user = await userModel.findOne({ email });
  if (!user) throw NotFoundException({ message: "Email Not Found" });
  if (user.twoStepVerification)
    throw BadRequestException({ message: "2-Step Verification Verifed" });
  await OTP.confirmOTP({ otp, userId: user._id });
  user.twoStepVerification = true;
  user.updatedAt = Date.now()
  await user.save();
  return { message: "2-Step Verification Verifed", data: user };
};

export const loginWithGmail = async ({ idToken }, issuer) => {
  let payload = await verifyGoogleId(idToken)
  let { email, given_name, family_name, picture } = payload
  let user = await userModel.findOne({ email })
  if (user) {
    let { accessToken, refreshToken } = generateToken({ user, issuer })
    return { accessToken, refreshToken }
  }
  user = await userModel.create({ email, firstName: given_name, lastName: family_name, image: picture, provider: ProviderEnum.Google, isVerfied: true })
  let { accessToken, refreshToken } = generateToken({ user, issuer })
  return { accessToken, refreshToken }
}

export const login = async ({ email, password }, issuer) => {
  let user = await userModel.findOne({ email });
  if (!user) return NotFoundException({ message: "User Not Found" });
  await blockUser(user._id)
  let isMatched = await compareHash({
    plainText: password,
    hashedText: user.password,
  });
  if (isMatched) {
    if (user.twoStepVerification) {
      await OTP.sendOTP({ recipients: { to: email }, userId: user._id, purpose: "2-Step Verification" })
      return { message: "OTP Send to email (Login Confirmation)" }
    } else {
      let { accessToken, refreshToken } = generateToken({ user, issuer });
      return {
        message: "Login Successfully",
        data: { accessToken, refreshToken },
      };
    }
  } else {
    await triesKey(user._id)
    throw BadRequestException({ message: "Password Wrong" })
  };
};

export const loginConfirmation = async ({ email, otp }, issuer) => {
  let user = await userModel.findOne({ email });
  if (!user) throw NotFoundException({ message: "Email Not Found" });
  await OTP.confirmOTP({ otp, userId: user._id });
  let { accessToken, refreshToken } = generateToken({ user, issuer });
  return {
    message: "Login Successfully",
    data: { accessToken, refreshToken },
  };
};

export const createNewAccessToken = async ({ refreshToken }) => {
  let token = rotateToken({ refreshToken, issuer });
  if (!token) throw BadRequestException("Invalid Token")
  return { data: { accessToken: token } };
};

export const forgetPassword = async ({ email }, issuer) => {
  let user = await userModel.findOne({ email })
  if (!user) throw NotFoundException({ message: "User Not Found" })
  OTP.sendOTP({ recipients: { to: email }, purpose: "Forget Password", userId: user._id })
  let resetId = crypto.randomUUID()
  await redis.set({ key: redis.getUserResetKey(user._id), value: resetId, ttl: 5 * 60 })
  return { message: "OTP Send Done" }
}

export const confirmForgetPassword = async ({ email, otp }) => {
  let user = await userModel.findOne({ email });
  if (!user) throw NotFoundException({ message: "Email Not Found" });
  await OTP.confirmOTP({ otp, userId: user._id });
  return { message: "Now, You can reset password" }
}

export const resetPassword = async ({ email, newPassword, confirmPassword }) => {
  let user = await userModel.findOne({ email });
  if (!user) throw NotFoundException({ message: "Email Not Found" });
  if (confirmPassword !== password) throw BadRequestException({ message: "Confirm Password Wrong" })
  user.password = generateHash({ plainText: newPassword })
  user.updatedAt = Date.now()
  await user.save();
  return { message: "New Password Saved" };
}

export const changePassword = async ({ oldPassword, newPassword, confirmPassword }, user) => {
  let isMathed = compareHash({ plainText: oldPassword, hashedText: user.password })
  if (!isMathed) throw BadRequestException({ message: "Password Wrong" })
  if (confirmPassword !== password) throw BadRequestException({ message: "Confirm Password Wrong" })
  let data = await user.updateOne({
    $set: {
      updatedAt: Date.now(),
      password: generateHash({ plainText: newPassword })
    }
  })
  await user.save();
  return { message: "New Password Saved" };
}

const blockUser = async (userId) => {
  const userPassRetries = await redis.get({ key: redis.getUserTriesKey(userId) });
  if (userPassRetries && Number(userPassRetries) >= env.MAX_PASS_RETRIES) {
    const ttl = await redis.ttl({ key });
    throw BadRequestException({
      message: `Try again after ${Math.ceil(ttl / 60)} minutes`
    });
  }
};

const triesKey = async (userId) => {
  let key = redis.getUserTriesKey(userId)
  if (await redis.exists({ key })) {
    await redis.incr({ key })
  } else {
    await redis.set({ key, value: 1, ttl: 2 * 60 })
  }
}

const verifyGoogleId = async (idToken) => {
  const client = new OAuth2Client();
  const ticket = await client.verifyIdToken({
    idToken,
    audience: env.GOOGLE_CLIENT_ID,
  });
  const payload = ticket.getPayload();
  if (!payload.email_verified) BadRequestException({ message: "email is not verified" })
  return payload
}