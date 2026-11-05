import crypto from "crypto";
import { BadRequestException, emailEvents, redis } from "../index.js";
import { decrypting, encrypting } from "./encrypting.service.js";

export const getUserKey = (userId) => `user::${userId.toString()}`;
export const getUserOTPKey = (userId) => `OTP::${getUserKey(userId)}`;

export const sendOTP = async ({ recipients, purpose, userId, expireIn = 5 }) => {
  if (await redis.exists({ key: getUserOTPKey(userId) })) throw BadRequestException({ message: "There is a OTP \nCheck your email" })
  let otp = crypto.randomInt(99999, 1000000);
  emailEvents.emit("sendOtpEmail", { recipients, otp, purpose, expireIn });
  let otpEnc = encrypting({ data: otp })
  await redis.set({
    key: getUserOTPKey(userId),
    value: otpEnc,
    ttl: expireIn * 60,
  });
};

export const confirmOTP = async ({ otp, userId }) => {
  if (await redis.exists({ key: getUserOTPKey(userId) }) === 0) throw BadRequestException({ message: "OTP Expired" });
  let userOTP = await redis.get({ key: getUserOTPKey(userId) });
  let otpDecn = decrypting({ data: userOTP });
  if (otp !== Number(otpDecn)) throw BadRequestException({ message: "OTP Wrong" });
  await redis.del({ key: getUserOTPKey(userId) });
};

