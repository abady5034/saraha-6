import { EventEmitter } from "node:events";
import { sendOtpEmail } from "../services/sendEmail.service.js";

export const emailEvents = new EventEmitter();

emailEvents.on(
  "sendOtpEmail",
  async ({ recipients, purpose, otp, expireIn }) => {
    try {
      const info = await sendOtpEmail({
        recipients,
        otp,
        purpose,
        expireIn,
      });
      console.log(" Email sent successfully:", info.messageId);
    } catch (error) {
      console.log(" Email sending failed:", error.message);
    }
  },
);
