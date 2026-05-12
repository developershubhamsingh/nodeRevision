import express from "express";
import dotenv from "dotenv";
dotenv.config();
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { DbConnect, getData } from "./dbConnect.js";
import cors from "cors";
import { buffer } from "stream/consumers";
let apps = express()
let port = 7000;
let key = process.env.KEY;
let v_user = process.env.V_U;
let v_pass = process.env.V_P;

apps.use(cors())
apps.use(express.json())

const basicAuth = async (req, res, next) => {
    let authHeader = req.headers.authorization;
    if (!authHeader || !authHeader.startsWith("Basic ")) {
        return res.status(401).send("unauthorized")
    }
    //decode with base64
    let base64Credential = authHeader.split(" ")[1];
    let credential = Buffer.from(base64Credential, "base64").toString("utf-8");
    let [username, password] = credential.split(":");
    if (username === v_user && password === v_pass) {
        return next()
    } else {
        return res.status(401).send("unauthorized")
    }

}

//heartbeat
apps.get("/", async (req, res) => {
    res.status(200).send("ok");
})

// List of all city (GET)
// apps.get("/location", async (req, res) => {
//     let query = {};
//     let authKey = req.headers["x-auth-token"];
//     if (authKey == key) {
//         let location = await getData("location", query);
//         res.status(200).send(location);
//     } else {
//         res.status(401).send("unauthorized");
//     }
// })
//============================================//
// apps.get("/location", basicAuth, async (req, res) => {
//     let query = {};
//     let location = await getData("location", query);
//     res.status(200).send(location);
// })
//============================================//
apps.get("/location", async (req, res) => {
    let query = {};
    let location = await getData("location", query);
    res.status(200).send(location);
})
// List of all restaurants(GET)
// # Restaurants wrt city (GET) 
apps.get("/restaurants", async (req, res) => {
    let query = {};
    let restCity = req.query.restCity;
    if (restCity) {
        query["state_id"] = Number(restCity)
    }
    let restaurants = await getData("restaurants", query);
    res.status(200).send(restaurants);
})
//# List of all meal (GET)
apps.get("/mealTypes", async (req, res) => {
    let query = {};
    let mealTypes = await getData("mealTypes", query);
    res.status(200).send(mealTypes);
})

apps.listen(port, () => {
    DbConnect();
    console.log("Server Running On Port", port)
}).on("error", (error) => {
    console.error("Error Starting Server", error)
})
