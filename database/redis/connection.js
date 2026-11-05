import redis from "redis";
import { env } from "../../config/env.service.js";

const url = env.URI_Redis;
const client = redis.createClient({ url });

export const redisConnection = async () => {
  try {
    await client.connect();
    console.log("Redis Connected");
    return client;
  } catch (e) {
    console.log(e);
  }
};
