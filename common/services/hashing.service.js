import { env } from "../../config/env.service.js";
import bcrypt from "bcrypt";

export const generateHash = async ({ plainText, salt = env.salt }) => {
  let hashedText = await bcrypt.hash(plainText, Number(salt));
  return hashedText;
};

export const compareHash = async ({ plainText, hashedText }) => {
  let isMatched = await bcrypt.compare(plainText, hashedText);
  return isMatched;
};
