import { BadRequestException, NotFoundException, StatusRequestEnum } from "../../common/index.js";
import { conversationModel } from "../../database/model/conversation.model.js";
import { messageModel } from "../../database/model/message.model.js";
import { requestModel } from "../../database/model/request.model.js";

export const startConversation = async ({ messageId }) => {
    let message = await messageModel.findById(messageId);
    if (!message) throw NotFoundException({ message: "Message Not Found" })
    let request = await requestModel.findOne({ messageId })
    if (request !== StatusRequestEnum.accepted) throw BadRequestException({ message: `Status Request is ${request.status}` })
    let data = await conversationModel.create({ messageId, reciverId: message.reciverId, senderId: message.senderId })
    if (!data) throw BadRequestException({ message: "Error" })
    return { message: "Conversation Started" }
}