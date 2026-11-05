import mongoose, { Types } from "mongoose";
import { MessageTypeEnum } from "../../common/index.js";


const messageSchema = new mongoose.Schema({
    content: {
        type: String,
        required: true,
        minLength: 5,
        maxLength: 5000,
    },
    reciverId: {
        type: Types.ObjectId,
        ref: "user",
        required: true,
    }, senderId: {
        type: Types.ObjectId,
        ref: "user",
        required: true,
    },
    type: {
        type: String,
        enum: MessageTypeEnum,
        default: MessageTypeEnum.anonymous
    },
    images: {
        type: [String]
    },
    conversationId: {
        type: Types.ObjectId,
        ref: "conversation",
        default: null
    },
    seen: Boolean, default: false
},
    {
        timestamps: true,
        strict: true,
    },)

export const messageModel = mongoose.model("message", messageSchema)