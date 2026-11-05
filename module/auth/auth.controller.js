import { Router } from "express";
import {
  signup,
  login,
  createNewAccessToken,
  verifyAccount,
  resendOtp,
  loginWithGmail,
  forgetPassword,
  twoStepVerification,
  loginConfirmation,
  verifyTwoStepVerification,
  resetPassword,
  changePassword,
  confirmForgetPassword,
} from "./auth.service.js";
import { validation, upload, auth } from "../../common/index.js";
import {
  createNewAccessTokenSchema,
  userLoginSchema,
  userSignupSchema,
} from "./auth.validation.js";
const router = Router();

router.get("/Check-Health", (req, res) => {
  res.json("Done from auth.controller.js");
});

router.post(
  "/signup",
  upload({ fileType: "image", customPath: "profileImage" }).single("profileImage"),
  upload({ fileType: "image", customPath: "coverImage" }).array("coverImage", 10),
  validation({ schema: userSignupSchema }),
  async (req, res) => {
    let data = await signup(req.body, req.file, req.files);
    res.json(data);
  },
);

router.post("/verify-account", async (req, res) => {
  let data = await verifyAccount(req.body);
  res.json(data);
});

router.post("/2-step-verification", async (req, res) => {
  let data = await twoStepVerification(req.body);
  res.json(data);
});


router.post("/confirm-2-step-verification", async (req, res) => {
  let data = await verifyTwoStepVerification(req.body);
  res.json(data);
});

router.post("/resend-otp", async (req, res) => {
  let data = await resendOtp(req.body);
  res.json(data);
});

router.post("/login", validation({ schema: userLoginSchema }), async (req, res) => {
  let issuer = `${req.protocol}://${req.host}`
  let data = await login(req.body, issuer);
  res.json(data);
});

router.post("/login-confirmation", async (req, res) => {
  let issuer = `${req.protocol}://${req.host}`
  let data = await loginConfirmation(req.body, issuer);
  res.json(data);
});

router.post("/login-with-google", async (req, res) => {
  let issuer = `${req.protocol}://${req.host}`
  let data = await loginWithGmail(req.body, issuer)
  res.json(data);
})

router.post(
  "/create-new-access-token",
  // validation(createNewAccessTokenSchema, "body"),
  async (req, res) => {
    let issuer = `${req.protocol}://${req.host}`
    let data = await createNewAccessToken(req.body);
    res.json(data);
  },
);

router.post("/forget-password", async (req, res) => {
  let issuer = `${req.protocol}://${req.host}`
  let data = await forgetPassword(req.body, issuer)
  res.json(data)
})
router.post("/confirm-forget-password", async (req, res) => {
  let data = await confirmForgetPassword(req.body)
  res.json(data)
})
router.post("/reset-password", async (req, res) => {
  let data = await resetPassword(req.body)
  res.json(data)
})

router.post("/change-password", auth, async (req, res) => {
  let data = await changePassword(req.body, req.user)
  res.json(data)
})

export default router;
