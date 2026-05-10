import express from "express";
import { dbConnect, getData } from "./dbConnect.js"

const Router = () => {
    let productsRouter = express.Router()

    productsRouter.get("/", async (req, res) => {
        let query = {};
        let products = await getData("products", query);
        res.render(products, { title: "Products Page" })
    })
    // productsRouter.get("/details", (req, res) => {
    //     res.send("productsRouter details")
    // })
    return productsRouter;
}
export default Router;