import dotenv from "dotenv";
import path from "path";
dotenv.config({ path: path.resolve(`./.env.${process.env.NODE_ENV}`) });

const mood = process.env.MOOD;
const port = process.env.PORT;
const URI_Database = process.env.DATABASE_URI;
const URI_Redis = process.env.REDIS_URI;
const ENC_ALGO = process.env.ENC_ALGO
const KEY = process.env.KEY
const IV_LENGTH = process.env.IV_LENGTH
const salt = process.env.HASH_SALT;
const adminAccess = process.env.ADMIN_ACCESS_SIGNATURE;
const adminRefresh = process.env.ADMIN_REFRESH_SIGNATURE;
const userAccess = process.env.USER_ACCESS_SIGNATURE;
const userRefresh = process.env.USER_REFRESH_SIGNATURE;
const ACCESS_EX = process.env.ACCESS_EX
const REFRESH_EX = process.env.REFRESH_EX
const appPassword = process.env.APP_PASSWORD;
const appEmail = process.env.APP_EMAIL;
const GOOGLE_CLIENT_ID = process.env.GOOGLE_CLIENT_ID
const GOOGLE_SECRET = process.env.GOOGLE_SECRET
const MAX_PASS_RETRIES = process.env.MAX_PASS_RETRIES

export const env = {
  mood,
  port: Number(port),
  URI_Database,
  URI_Redis,
  salt: Number(salt),
  adminAccess,
  adminRefresh,
  userAccess,
  userRefresh,
  ACCESS_EX,
  REFRESH_EX,
  appPassword,
  appEmail,
  ENC_ALGO,
  KEY,
  IV_LENGTH: Number(IV_LENGTH),
  GOOGLE_CLIENT_ID,
  GOOGLE_SECRET,
  MAX_PASS_RETRIES: Number(MAX_PASS_RETRIES)
};
