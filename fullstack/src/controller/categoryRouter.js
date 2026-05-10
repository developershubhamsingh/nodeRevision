import express from "express";
import { getData } from "./dbConnect.js";

const Router = () => {
    let categoryRouter = express.Router()

    categoryRouter.get("/", async (req, res) => {
        let query = {};
        let category = await getData("category", query);
        res.render("categoryRouter", { title: "category Page", category })
    })

    return categoryRouter;
}
export default Router;