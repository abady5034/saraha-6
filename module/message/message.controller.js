import Router from "express"
import { getAllMessage, getAllMessageconv, sendMessage, sendMessageConv, } from "./message.service.js";
import { auth, upload, validation } from "../../common/index.js";
import { messageValidationSchema } from "./message.validation.js";
const router = Router()

router.post("/send-message", validation({ schema: messageValidationSchema }), auth, upload({ fileType: "image", customPath: "message" }).array("images"), async (req, res) => {
    let data = await sendMessage(req.body, req.files, req.user)
    res.json(data)
})

router.post("/send-message/:conversationId", validation({ schema: messageValidationSchema }), auth, upload({ fileType: "image", customPath: "message" }).array("images"), async (req, res) => {
    let data = await sendMessageConv(req.params, req.body, req.files, req.user)
    res.json(data)
})

router.get("/Check-Health", (req, res) => {
    res.json("Done from message.controller.js");
});

router.get("/get-all-message", auth, async (req, res) => {
    let data = await getAllMessage(req.user)
    res.json(data)
})

router.get("/get-all-message/:conversationId", auth, async (req, res) => {
    let data = await getAllMessageconv(req.params, req.user)
    res.json(data)
})
export default router