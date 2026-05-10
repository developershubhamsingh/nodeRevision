import express from "express";
import { createClient } from "redis";
import axios from "axios";
import dotenv from "dotenv";
dotenv.config();
import path from "path";
import { fileURLToPath } from "url";

let apps = express();
let port = 7000;

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename)

apps.set("views", "./src/view");
apps.set("view engine", "ejs");

let client = createClient({
    socket: {
        host: "localhost",
        port: 6379,
    }
})

client.on("error", (error) => {
    console.error("Error Connecting To Client", error)
})

await client.connect();

apps.get("/", async (req, res) => {
    let city = req.query.city ? req.query.city.toLowerCase() : "Delhi";
    let url = `https://api.openweathermap.org/data/2.5/forecast?q=${city},IN&units=metric&appid=${process.env.KEY}`
    let cacheData = await client.get(city);
    if (cacheData) {
        let result = JSON.parse(cacheData);
        console.log("redis cache")
        return res.status(200).render("index", {
            title: "Weather App",
            source: "redis cache",
            result
        })
    }
    let urlResponse = await axios.get(url);
    let result = urlResponse.data;
    await client.set(city, (JSON.stringify({ source: "api response", result })), ({ Ex: 3600 }));

    console.log("api response")
    return res.status(200).render("index", {
        title: "Weather App",
        source: "api response",
        result
    })
    process.on("SIGINT", async (req, res) => {
        await client.quit();
        process.exit(0);
    })
})

apps.listen(port, () => {
    console.log("Server Running on Port", port)
}).on("error", (error) => {
    console.error("Error Starting Server", error)
})