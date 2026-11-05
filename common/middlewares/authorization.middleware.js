import { userModel } from "../../database/model/user.model.js";
import {
  ForbiddenException,
  NotFoundException,
  UnAuthorizedException,
} from "../exceptions/error.exceptions.js";

export const authorization = ({ roles }) => {
  return async (req, res, next) => {
    if (!roles.includes(req.user.role)) throw ForbiddenException({ message: "Not allowed" })
    next()
  };
};
