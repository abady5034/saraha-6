import mongoose, { Schema } from "mongoose";
import { GenderEnum, ProviderEnum, RoleEnum } from "../../common/index.js";

const userSchema = new Schema(
  {
    firstName: {
      type: String,
      required: true,
      min: 3,
      max: 50,
      trim: true,
    },
    lastName: {
      type: String,
      required: true,
      min: 3,
      max: 50,
      trim: true,
    },
    email: {
      type: String,
      unique: true,
      lowerCase: true,
      trim: true,
    },
    password: {
      type: String,
      required: true,
      trim: true,
    },
    age: {
      type: Number,
      min: 18,
    },
    phoneNumber: {
      type: [String],
    },
    gender: {
      type: String,
      enum: GenderEnum,
      default: GenderEnum.Male,
    },
    provider: {
      type: String,
      enum: ProviderEnum,
      default: ProviderEnum.System,
    },
    role: {
      type: String,
      enum: RoleEnum,
      default: RoleEnum.User,
    },
    profileImage: {
      type: String,
      default: undefined,
    },
    coverImage: {
      type: [String],
      default: undefined,
    },
    isVerfied: {
      type: Boolean,
      default: false,
    },
    twoStepVerification: {
      type: Boolean,
      default: false,
    },
    url: {
      type: String,
      required: true,
      unique: true
    }
  },
  {
    timestamps: true,
    strict: true,
    toJSON: { virtuals: true },
    toObject: { virtual: true },
  },
);

userSchema.virtual("fullName").get(function () {
  return `${this.firstName} ${this.lastName}`;
});

export const userModel = mongoose.model("user", userSchema);
