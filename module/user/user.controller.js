import { Router } from "express";
import { deleteAccount, getAllData, getProfile, getUrl, updateUser } from "./user.service.js";
import { auth, authorization, upload, validation } from "../../common/index.js";
import { authorizationSchema } from "./user.validation.js";

const router = Router();

router.get("/Check-Health", async (req, res) => {
  res.json("Done from user.controller.js");
});

router.get("/getProfile", validation(authorizationSchema, "headers"), auth, async (req, res) => {
  let data = await getProfile(req.user);
  res.json(data);
});

router.get("/get-url", auth, async (req, res) => {
  let data = await getUrl(req.user)
  res.json(data)
})

router.get('/get-all-data', validation(authorizationSchema, "headers"), auth, authorization(["admin"]), async (req, res) => {
  let data = await getAllData()
  res.json(data)
})

router.put("/update-user:id", auth, upload({ fileType: "image" }).single("profileImage"), upload({ fileType: "image" }).array("coverImage"), async (req, res) => {
  let data = await updateUser(req.body, req.file, req.files, req.user);
  res.json(data)
})

router.delete("/delete-account/:id", auth, async (req, res) => {
  let data = await deleteAccount(req.params, req.user)
  res.json(data)
})

router.delete("/confirm-delete-account", auth, async (req, res) => {
  let data = await confirmDeleteAccount(req.body, req.user)
  res.json(data)
})

export default router;
