import express from "express";
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { DbConnect, getData } from "./dbConnect.js"
let apps = express()
let port = 7000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

apps.use("/uploads", express.static(path.join(__dirname, "uploads")))
apps.set("views", "./src/view")
apps.set("view engine", "ejs")
apps.use(express.urlencoded({ extended: true }))

const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, path.join(__dirname, "uploads"))
    },
    filename: (req, file, cb) => {
        cb(null, `${Date.now()} -${file.originalname}`)
    }
})

const fileFilter = (req, file, cb) => {
    let allowedTypes = /jpg|jpeg|png/;
    let mimeTypes = allowedTypes.test(file.mimetype);
    const extName = allowedTypes.test(
        path.extname(file.originalname).toLowerCase()
    );

    if (mimeTypes) {
        cb(null, true)
    } else {
        cb(new Error("only jpg|jpeg|png are allowed"), false)
    }
}

const uploads = multer({
    storage: storage,
    limits: { fileSize: 5 * 1024 * 1024 },
    fileFilter: fileFilter
})

apps.get("/", async (req, res) => {
    res.render("index")
})
apps.post("/uploads", uploads.single("image"), async (req, res) => {
    if (!req.file) {
        return res.status(401).send("No file uploaded")
    }
    const data = {
        name: req.body.name,
        email: req.body.email,
        imagePath: `/uploads/${req.file.filename}`,
        UploadedOn: new Date().toLocaleString()
    }
    try {
        await DbConnect();
        await getData("Image", data)
    } catch (error) {
        console.error("error uploading image in database", error)
    }
    res.status(200).render("success", data);
})



apps.listen(port, () => {
    console.log("Server Running On Port", port)
}).on("error", (error) => {
    console.error("Error Starting Server", error)
})
