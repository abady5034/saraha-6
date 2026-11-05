import { env } from "../../config/env.service.js";

export const ErrorResponse = ({
  satus = 400,
  message = "Something went wrong",
  extra = undefined,
} = {}) => {
  throw new Error(message, { cause: { satus, extra } });
};

export const BadRequestException = ({
  message = "Bad Request",
  extra = undefined,
} = {}) => {
  return ErrorResponse({ satus: 400, message, extra });
};

export const NotFoundException = ({
  message = "Not Found Error",
  extra = undefined,
} = {}) => {
  return ErrorResponse({ satus: 404, message, extra });
};

export const ConflictException = ({
  message = "Conflict Error",
  extra = undefined,
} = {}) => {
  return ErrorResponse({ satus: 409, message, extra });
};

export const UnAuthorizedException = ({
  message = "UnAuthorized Error",
  extra = undefined,
} = {}) => {
  return ErrorResponse({ satus: 401, message, extra });
};

export const ForbiddenException = ({
  message = "Forbidden Error",
  extra = undefined,
} = {}) => {
  return ErrorResponse({ satus: 403, message, extra });
};
