import jwt from "jsonwebtoken";
import { env } from "../../config/env.service.js";

export const generateToken = ({ user, issuer }) => {
  let signature;
  let refreshSignature;
  let aud;
  switch (user.role) {
    case "0":
      signature = env.userAccess;
      refreshSignature = env.userRefresh;
      aud = "user";
      break;
    case "1":
      signature = env.adminAccess;
      refreshSignature = env.adminRefresh;
      aud = "admin";
      break;
  }
  let accessToken = jwt.sign({ id: user._id }, signature, {
    expiresIn: env.ACCESS_EX,
    audience: aud,
    issuer
  });
  let refreshToken = jwt.sign({ id: user._id }, refreshSignature, {
    expiresIn: env.REFRESH_EX,
    audience: aud,
    issuer
  });
  return { accessToken, refreshToken };
};

export const rotateToken = ({ refreshToken, issuer }) => {
  let decoded = jwt.decode(refreshToken);
  let signature;
  let aud;
  switch (decoded.aud) {
    case "user":
      signature = env.userAccess;
      aud = "user";
      break;
    case "admin":
      signature = env.adminAccess;
      aud = "admin";
      break;
  }
  let accessToken = jwt.sign({ id: decoded.id }, signature, {
    expiresIn: env.ACCESS_EX,
    audience: aud,
    issuer
  });

  return accessToken;
};