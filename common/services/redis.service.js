import { client } from "../../main.js";

export const set = async ({ key, value, ttl = undefined }) => {
  if (typeof value !== "string") {
    value = JSON.stringify(value);
  }
  await client.set(key, value, { EX: ttl });
};

export const get = async ({ key }) => {
  let data = await client.get(key);
  let result;
  try {
    result = JSON.parse(data);
  } catch {
    result = data;
  }
  return result;
};

export const del = async ({ key }) => await client.del(key);
export const exists = async ({ key }) => await client.exists(key);
export const ttl = async ({ key }) => await client.ttl(key);
export const incr = async ({ key }) => await client.incr(key);
export const prefix = async ({ prefix }) => await client.keys(`${prefix}*`);

export const getUserKey = (userId) => `user::${userId.toString()}`;
export const getUserOTPKey = (userId) => `OTP::${getUserKey(userId)}`;
export const getUserTriesKey = (userId) => `Bloked::${getUserKey(userId)}`;
export const getUserResetKey = (userId) => `Reset Password::${getUserKey(userId)}`;