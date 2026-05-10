import express from "express";
import { dbConnect, getData } from "./dbConnect.js"

const Router = (nav) => {
    let productsRouter = express.Router()

    productsRouter.get("/", async (req, res) => {
        let query = {};
        let products = await getData("products", query);
        res.render("productsRouter", { title: "Products Page", products, nav })
    })
    productsRouter.get("/list/:id", async (req, res) => {
        let { id } = req.params;
        let query = {};
        if (id) {
            query["category_id"] = Number(id);
        }
        let products = await getData("products", query);
        res.render("productsRouter", { title: "Products Page", products, nav })
    })
    return productsRouter;
}
export default Router;