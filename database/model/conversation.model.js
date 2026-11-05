import mongoose from "mongoose"

let conversationSchema = mongoose.Schema({
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
    }, seen: Boolean, default: false
}, { timestamps: true, })

export const conversationModel = mongoose.model("conversation", conversationSchema)