import { BadRequestException } from "../exceptions/error.exceptions.js";

export const validation = ({ schema }) => {

  return (req, res, next) => {
    let { success, error, data } = schema(req.headers["accept-language"]).safeParse({
      body: req.body,
      params: req.params,
      query: req.query,
      headers: req.headers,
      file: req.file,
      file: req.files
    })
    if (!success)
      throw BadRequestException({
        message: "Invalid Data",
        extra: error.issues,
      });
    req.validate = data
    console.log(data);

    next();
  };
};
