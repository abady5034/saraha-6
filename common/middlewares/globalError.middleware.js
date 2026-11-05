import multer from "multer";
import { env } from "../../config/env.service.js";

export const globalHandlingError = (err, req, res, next) => {
    if (err instanceof multer.MulterError) {
        console.log(err)
        res.status(err.status || err.cause || 500).json({
            type: "Multer Error",
            message: err.message,
            code: err.code,
            storageErrors: err.storageErrors,
            filed: err.field,
            fileName: err.fileName
        })
    } else {
        const mood = env.mood === "dev";
        const status = err.satus ? err.satus : err.cause ? err.cause.satus : 500;
        const defaultMessage = "Something Went Wrong";
        // const displayErrorMessage = err.message || defaultMessage;
        res.status(status).json({
            message: err.message,
            stack: mood ? err.stack : null,
            extra: mood ? err.cause : null,
        });
    }
};