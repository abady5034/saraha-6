import z from "zod";
import { isValidObjectId } from 'mongoose'

const errorValidation = {
    invalidObjectId: {
        "en": "Invalid ObjectId",
        "ar": "معرف مونجو غير صحيح"
    }
}

const getErrorMessage = (errCode, lang = "en") => {
    return errorValidation[errCode][lang];
};


export const messageValidationSchema = (lang) => z.object({
    body: z.object({
        content: z.string().min(3).max(5000),
        senderId: (lang) => z.string().min(24).max(24).refine((value) => isValidObjectId(value), { error: getErrorMessage("invalidObjectId", lang) }),
        reciverId: (lang) => z.string().min(24).max(24).refine((value) => isValidObjectId(value), { error: getErrorMessage("invalidObjectId", lang) }),
    })
    ,
    files: z.strictObject({
        images: z.array({
            fieldname: (lang) => z.string(),
            originalname: (lang) => z.string(),
            encoding: (lang) => z.string(),
            mimetype: (lang) => z.string(),
            size: (lang) => z.string(),
            destination: (lang) => z.string().optional(),
            filename: (lang) => z.string().optional(),
            path: (lang) => z.string().optional(),
            buffer: (lang) => z.string().optional()
        }).optional()

    })
})