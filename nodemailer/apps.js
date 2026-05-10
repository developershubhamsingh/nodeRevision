import express, { response } from "express";
import nodemailer from "nodemailer";
import dotenv from "dotenv";
dotenv.config();

let apps = express();
let port = process.env.PORT || 7800;

let transporter = nodemailer.createTransport({
    host: "smtp.gmail.com",
    port: 587,
    secure: false,
    auth: {
        user: process.env.USER,
        pass: process.env.PASS,
    }
})
apps.get("/", async (req, res) => {
    try {
        let mailOption = {
            from: process.env.USER,
            to: process.env.RECEIVER,
            subject: "Nodemailer Test mail ",
            text: "This is a test mail from node Mailer ."
        }
        let info = await transporter.sendMail(mailOption);
        res.status(200).json({
            success: true,
            message: " Email Sent Successfully .",
            response: info.response
        })
    } catch (error) {
        res.status(200).json({
            success: false,
            message: "Error Sending Email  .",
            error: error.message
        })
    }
})

apps.listen(port, () => {
    console.log("Server Is Running on Port", port);
}).on("error", (error) => {
    console.error("Error Starting Server", error);
}) 