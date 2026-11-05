import nodemailer from "nodemailer";
import { env } from "../../config/env.service.js";
import { emailTemplate } from "../templates/email.template.js";
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: env.appEmail,
    pass: env.appPassword,
  }, tls: {
    rejectUnauthorized: false
  }
});

export const sendOtpEmail = async ({
  recipients,
  otp,
  purpose,
  expireIn
}) => {
  try {
    const info = await transporter.sendMail({
      from: `"ABADY" <${env.appEmail}>`,
      ...recipients,
      subject: `ABADY - ${purpose}`,
      html: emailTemplate({ purpose, otp, expireIn }),
      attachments: [
        {
          filename: "logo.png",
          path: "./src/common/assets/logo.png",
          cid: "brand-logo",
        },
      ],
    });
    return info;
  } catch (error) {
    console.error("Email sending failed:", error);
    throw error;
  }
};
