import jwt from "jsonwebtoken";
import { env } from "../../config/env.service.js";
import {
  BadRequestException,
  NotFoundException,
  UnAuthorizedException,
} from "../exceptions/error.exceptions.js";
import { AuthEnum } from "../Enums/enum.js";
import { userModel } from "../../database/model/user.model.js";
import { compareHash } from "../index.js"
export const auth = async (req, res, next) => {
  let authorization = req.headers.authorization;
  if (!authorization) throw UnAuthorizedException({ message: "Auth Users Only" })
  let [prefix, token] = authorization.split(" ")
  switch (prefix) {
    case AuthEnum.Basic:
      let data = Buffer.from(token, "base64").toString()
      let [email, password] = data.split(":")
      let user = await userModel.findOne({ email })
      if (!user) throw NotFoundException({ message: "Email not found" })
      let check = compareHash({ plainText: password, hashedText: user.password })
      if (!check) NotFoundException({ message: "Password Wrong" })
      req.user = user
      next()
      break
    case AuthEnum.Bearer:
      let decoded = jwt.decode(token);
      let signature;
      switch (decoded.aud) {
        case "admin":
          signature = env.adminAccess;
          break;
        case "user":
          signature = env.userAccess;
          break;
      }
      try {
        let decodedData = jwt.verify(token, signature);
        let user = await userModel.findOneById(decodedData.id)
        if (!user) throw NotFoundException({ message: "Email not found" })
        req.user = user;
        next();
      } catch (err) {
        UnAuthorizedException({ message: "Invalid Token" });
      }
  }
};
