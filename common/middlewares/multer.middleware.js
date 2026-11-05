import multer from "multer";
import path from "path"
import { BadRequestException } from "../exceptions/error.exceptions.js";

export const fileTypes = {
  image: ["image/png", "image/jpg", "image/jpeg", "image/webp"],
  pdf: ["application/pdf"],
  video: ["video/mp4",]
}

export const upload = ({ fileType, customPath }) => {
  let storage = multer.diskStorage({
    destination: (req, file, cb) => {
      let folderPath = path.resolve("./uploads")
      if (customPath) {
        folderPath = path.resolve(`./uploads/${customPath}`)
      }
      if (!fs.existsSync(folderPath)) {
        fs.mkdirSync(folderPath)
      }
      cb(null, folderPath)
    },
    filename: (req, file, cb) => {
      cb(null, `${Date.now()}-${file.originalname}`)
    }
  })
  let fileFilter = (req, file, cb) => {
    if (!fileTypes.fileType.includes(file.mimetype)) {
      cb(BadRequestException({ message: "Wrong File Type" }))
    }

    cb(null, true)
  }
  return multer({
    storage,
    fileFilter
  })
}