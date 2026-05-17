import express from "express";
import cors from "cors";
import dotenv from "dotenv";
dotenv.config();
import { DbConnect, getData, getDataSort, getDataSortLimit } from "./dbConnect.js";
let apps = express();
let port = 7000;

let key = process.env.KEY;
let v_user = process.env.V_U;
let v_pass = process.env.V_P;

apps.use(cors());
apps.use(express.json());

const basicAuth = async (req, res, next) => {
    const authHeaders = req.headers.authorization;
    if (!authHeaders || !authHeaders.startsWith("Basic")) {
        return res.status(401).send("unauthorized");
    }
    const base64Credentials = authHeaders.split(" ")[1];;
    const credentials = Buffer.from(base64Credentials, "base64").toString("utf-8");
    const [username, passwords] = credentials.split(":")
    if (username === v_user && passwords === v_pass) {
        return next();
    } else {
        return res.status(401).send("unauthorized");
    }
}
//heartbeat//
apps.get("/", async (req, res) => {
    res.send("ok");
})

// # List of all city (GET)
// http://localhost:7000/city
apps.get("/city", async (req, res) => {
    try {
        let query = {}
        // let authKey = req.headers["x-auth-token"];
        // if (authKey == key) {
        let city = await getData("location", query);
        res.status(200).send(city);
        // } else {
        // res.status(401).send("unauthorized");
        // }
    } catch (error) {
        res.status(401).send("cannot get city data", error);
    }
})

// ===================================================//
// List of all restaurants(GET)
// http://localhost:7000/restaurants
apps.get("/restaurants", async (req, res) => {
    try {
        let query = {}

        // Restaurants wrt city (GET) 
        // http://localhost:7000/restaurants?restCity=3
        let restCity = req.query.restCity;
        if (restCity) {
            query["state_id"] = Number(restCity);
        }

        // Restaurants wrt mealTypes (GET)
        // http://localhost:7000/restaurants?restMealTypes=3
        let restMealTypes = req.query.restMealTypes;
        if (restMealTypes) {
            query["mealTypes.mealtype_id"] = Number(restMealTypes);
        }

        // List of Restaurants wrt mealTypes + cost (GET)
        // http://localhost:7000/restaurants?restMealTypes=1&lCost=100&hCost=700
        let lCost = req.query.lCost;
        let hCost = req.query.hCost;

        if (lCost || hCost) {
            query["cost"] = {};

            if (lCost) {
                query["cost"]["$gte"] = Number(lCost);
            }
            if (hCost) {
                query["cost"]["$lte"] = Number(hCost);
            }
        }
        //List of Restaurants wrt mealTypes + cuisine(GET)
        //http://localhost:7000/restaurants?restMealTypes=3&cuisine=3 
        let cuisine = req.query.cuisine;
        if (cuisine) {
            query["cuisines.cuisine_id"] = Number(cuisine);
        }

        // Sort on basis of price (GET)
        // by default sorting is by cost low to high
        // let sort = { cost: 1 }
        // dynamic sorting👇
        // http://localhost:7000/restaurants?sortKey=cost&sortOrder=1
        // http://localhost:7000/restaurants?sortKey=cost

        let sortKey = req.query.sortKey
        let sortOrder = req.query.sortOrder || 1;
        let sort = {}
        if (sortKey && sortOrder) {
            sort[sortKey] = Number(sortOrder);
        }
        // Pagination(GET)
        // http://localhost:7000/restaurants?sortKey=cost&skip=0&limit=3
        let skip = Number(req.query.skip) || 0;
        let limit = Number(req.query.limit) || 100000;



        let restaurants = await getDataSortLimit("restaurants", query, sort, skip, limit);
        res.status(200).send(restaurants);
    } catch (error) {
        res.status(401).send("cannot get data", error);
    }
})

// ===================================================//
// List of all meal (GET)
apps.get("/mealTypes", async (req, res) => {
    try {
        let query = {}
        let mealTypes = await getData("mealTypes", query);
        res.status(200).send(mealTypes);
    } catch (error) {
        res.status(401).send("cannot get data", error);
    }
})
// ===================================================//

apps.listen(port, () => {
    DbConnect()
    console.log(`server is running on port ${port}`);
}).on("error", (err) => {
    console.log("Error in running the server", err);
})