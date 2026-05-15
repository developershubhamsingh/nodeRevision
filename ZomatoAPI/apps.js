import express from "express";
import dotenv from "dotenv";
dotenv.config();
import multer from "multer";
import path from "path";
import { fileURLToPath } from "url";
import { DbConnect, getData, getDataSort, getDataSortLimit } from "./dbConnect.js";
import cors from "cors";
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
// Restaurants wrt city (GET) 
// Restaurants wrt mealTypes (GET)
// List of Restaurants wrt mealTypes + cuisine(GET) 
// List of Restaurants wrt mealTypes + cost (GET)
// Sort on basis of price (GET)

apps.get("/restaurants", async (req, res) => {
    let query = {};
    let restCity = req.query.restCity;
    let mealsTypes = req.query.mealsTypes;
    let cuisine = req.query.cuisine;
    let lcost = req.query.lcost;
    let hcost = req.query.hcost;
    //default sorting by cost low to high no need to write any conditions 👇
    // let sort = { cost: 1 };
    //dynamic sorting👇 
    let sortKey = req.query.sortKey;
    let sortOrder = req.query.sortOrder;
    let skip = Number(req.query.skip )|| 0;
    let limit = Number(req.query.limit) || 1000000000;

    
    if (restCity) {
        query["state_id"] = Number(restCity)
    }
    if (mealsTypes) {
        query["mealTypes.mealtype_id"] = Number(mealsTypes)
    }
    if (cuisine) {
        query["cuisines.cuisine_id"] = Number(cuisine)
    }
    if (lcost || hcost) {

        query["cost"] = {};

        if (lcost) {
            query["cost"]["$gte"] = Number(lcost);
        }

        if (hcost) {
            query["cost"]["$lte"] = Number(hcost);
        }
    }
    //if only want this condition then we can use this code
    // if (lcost && hcost) {
    //     query["cost"] = {
    //         $gte: Number(lcost),
    //         $lte: Number(hcost)
    //     }
    // }

    //dynamic sorting👇
    let sort = {};
    if (sortKey && sortOrder) {
        sort[sortKey] = Number(sortOrder);
    }
    let restaurants = await getDataSortLimit("restaurants", query, sort, skip, limit);
    res.status(200).send(restaurants);
})
// List of all meal (GET)
apps.get("/mealTypes", async (req, res) => {
    let query = {};
    let mealTypes = await getData("mealTypes", query);
    res.status(200).send(mealTypes);
})
//============================================//
// Details of Restaurants wrt ID (GET)
apps.get("/restaurants/:id", async (req, res) => {
    let query = {};
    let rest_details = req.params.id;
    if (rest_details) {
        query["restaurant_id"] = Number(rest_details)
    }
    let restaurants = await getData("restaurants", query);
    res.status(200).send(restaurants);
})
//============================================//


apps.listen(port, () => {
    DbConnect();
    console.log("Server Running On Port", port)
}).on("error", (error) => {
    console.error("Error Starting Server", error)
})
