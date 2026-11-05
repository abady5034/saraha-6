import mongoose from "mongoose";
import { StatusRequestEnum } from "../../common/index.js";

const requestSchema = mongoose.Schema({
    messageId: {
        type: mongoose.Types.ObjectId,
        ref: "message",
        required: true,
    },
    reciverId: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true,
    },
    senderId: {
        type: mongoose.Types.ObjectId,
        ref: "user",
        required: true,
    },
    status: {
        type: String,
        enum: StatusRequestEnum,
        default: StatusRequestEnum.pending,
    }
}, { timestamps: true, strict: true })

export const requestModel = mongoose.model("requset", requestSchema)