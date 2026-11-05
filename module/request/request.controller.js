import Router from "express"
import { getRequest, sendRequest } from "./request.service.js";
import { auth } from "../../common/index.js";

const router = Router()

router.get("/Check-Health", (req, res) => {
    res.json("Done from request.controller.js");
});

router.get("/get-all-request", auth, async (req, res) => {
    let data = await getAllRequset(req.user)
    res.json(data)
})

router.post("/send-request/:messageId", auth, async (req, res) => {
    let data = await sendRequest(req.params, req.user)
    res.json(data)
})

router.get("/get-request/:requestId", auth, async (req, res) => {
    let data = await getRequest(req.params, req.body, req.user)
    res.json(data)
})

export default router