import { BadRequestException, ConflictException, MessageTypeEnum, NotFoundException, StatusRequestEnum } from "../../common/index.js"
import { conversationModel } from "../../database/model/conversation.model.js"
import { messageModel } from "../../database/model/message.model.js"
import { requestModel } from "../../database/model/request.model.js"
import { userModel } from "../../database/model/user.model.js"

export const sendMessage = async ({ url, content }, files = null, user) => {
    let reciver = await userModel.findOne({ url })
    if (!reciver) throw NotFoundException({ message: "User Not Found" })
    let data = await messageModel.create({
        content,
        reciverId: reciver._id,
        senderId: user._id,
        images: files.path
    })
    return { message: "Message Send Done", data }
}

export const sendMessageConv = async ({ conversationId }, { url, content }, files = null, user) => {
    let conversation = await conversationModel.findById(conversationId)
    if (!conversation) throw NotFoundException({ message: "Conversation Not Found" })
    let reciver = await userModel.findOne({ url })
    if (!reciver) throw NotFoundException({ message: "User Not Found" })
    let data = await messageModel.create({
        content,
        reciverId: reciver._id,
        senderId: user._id,
        images: files.path,
        type: MessageTypeEnum.conversation,
        conversationId
    })
    return { message: "Message Send Done", data }
}

export const getAllMessage = async (user) => {
    let data = await messageModel.find({ reciverId: user._id }).select("-senderId")
    if (data.length === 0) throw NotFoundException({ message: "No Message Found" })
    return { message: "Message", data }
}

export const getAllMessageconv = async ({ conversationId }, user) => {
    let conversation = await conversationModel.findById(conversationId)
    if (!conversation) throw NotFoundException({ message: "Conversation Not Found" })
    let data = await messageModel.find({ conversationId })
    if (data.length === 0) throw NotFoundException({ message: "No Message Found" })
    return { message: "Message", data }
}

