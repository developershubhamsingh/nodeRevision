import express from "express";
import { dbConnect, getData } from "./dbConnect.js"

const Router = () => {
    let productsRouter = express.Router()

    productsRouter.get("/", async (req, res) => {
        let query = {};
        let products = await getData("products", query);
        res.render("productsRouter", { title: "Products Page", products })
    })
    // productsRouter.get("/details", (req, res) => {
    //     res.send("productsRouter details")
    // })
    return productsRouter;
}
export default Router;