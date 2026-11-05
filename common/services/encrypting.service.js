import crypto from "crypto"
import { env } from "../../config/env.service.js"

export const encrypting = ({ data }) => {
    let key = Buffer.from(env.KEY, "hex")
    const iv = crypto.randomBytes(env.IV_LENGTH)
    const cipher = crypto.createCipheriv(env.ENC_ALGO, key, iv)
    let encrypted = cipher.update(String(data), "utf-8", "hex")
    encrypted += cipher.final("hex")
    return `${iv.toString("hex")}::${encrypted}`
}

export const decrypting = ({ data }) => {
    let [iv, cipher] = String(data).split("::")
    iv = Buffer.from(iv, "hex")
    let key = Buffer.from(env.KEY, "hex")
    let plainText = crypto.createDecipheriv(env.ENC_ALGO, key, iv)
    let result = plainText.update(cipher, "hex", "utf-8")
    result += plainText.final("utf-8")
    return result
}

