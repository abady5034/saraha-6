import Router from "express"
import { startConversation } from "./conversation.service.js";
const router = Router()

router.get("/Check-Health", (req, res) => {
    res.json("Done from conversation.controller.js");
});

router.get("/start-conversation/:messageId", auth, async (req, res) => {
    let data = await startConversation(req.params)
    res.json(data)
})

export default router



