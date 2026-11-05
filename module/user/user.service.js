import { BadRequestException, NotFoundException, OTP, sendOtpEmail, UnAuthorizedException } from "../../common/index.js";
import { userModel } from "../../database/model/user.model.js";

export const getAllData = async () => {
  let data = await userModel.find().select("-passwordc -__v")
  if (data) return { message: "Done", data };
  else return NotFoundException();
};

export const getProfile = async (user) => {
  return { message: "Done", data: user }
};


export const getUrl = async (user) => {
  let url = user.url
  if (!url) throw BadRequestException({ message: "Error" })
  return { message: "Done", url }
}

export const updateUser = async ({ firstName, lastName, age, phoneNumber, }, { profileImage = null }, { coverImage = null }, user) => {
  let data = await userModel.updateOne({ id: user._id }, { firstName, lastName, age, phoneNumber, profileImage: profileImage.path, coverImage: coverImage.path }, { returnDocument: "after" })
  return { message: "Done", data }
}

export const deleteAccount = async ({ id }, user) => {
  if (user.id.toString() !== id) throw UnAuthorizedException()
  OTP.sendOTP({ recipients: { to: user.email }, userId: user._id, purpose: "Delete Account" })
  return { message: "OTP Send Done" }
}

export const confirmDeleteAccount = async ({ email, otp }, user) => {
  if (user.email !== email) throw UnAuthorizedException()
  OTP.confirmOTP({ otp, userId: user._id })
  let data = await userModel.findByIdAndDelete(user._id)
  return { message: "User Deleted" }
}