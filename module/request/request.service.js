import { BadRequestException, ConflictException, NotFoundException, statusEnum, UnAuthorizedException } from "../../common/index.js"
import { messageModel } from "../../database/model/message.model.js"
import { requestModel } from "../../database/model/request.model.js"

export const getAllRequset = async (user) => {
    let data = await requestModel.find({ senderId: user.id })
    if (data.length === 0) throw NotFoundException({ message: "No Request Found" })
    return { message: "Done", data }
}

export const sendRequest = async (messageId, user) => {
    let message = await messageModel.findOneById(messageId)
    if (!message) throw NotFoundException({ message: "Message Not Found" })
    if (user.id !== message.reciverId.toString()) throw UnAuthorizedException({ message: "You are not reciver" })
    let data = await requestModel.create({
        messageId,
        reciverId: user.id,
        senderId: message.senderId,
        status: StatusRequestEnum.pending
    })
    if (!data) throw BadRequestException()
    return { message: "Requset Done", data }
}

export const getRequest = async (requestId, { status }, user) => {
    const request = await requestModel.findById(requestId);
    if (!request) throw NotFoundException({ message: "Request Not Found" });
    if (request.senderId.toString() !== user.id) throw UnAuthorizedException({ message: "You are not allowed to update this request", });
    if (request.status !== StatusRequestEnum.pending) {
        throw BadRequestException({ message: `Request Status is ${request.status}`, });
    }
    if (![StatusRequestEnum.accepted, StatusRequestEnum.rejected].includes(status)) {
        throw BadRequestException({ message: "Invalid Request Status" });
    }
    request.status = status;
    await request.save();
    return { message: "Done", data: request };
};