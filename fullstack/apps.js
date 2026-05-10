import express from "express";
import path from "path";
import { fileURLToPath } from "url";
import categoryRouter from "./src/controller/categoryRouter.js";
import productsRouter from "./src/controller/productsRouter.js";
import { dbConnect } from "./src/controller/dbConnect.js"
import { link } from "fs";

let apps = express();
let port = 7000;

let nav = [
    { link: "/", name: "home" },
    { link: "/category", name: "category" },
    { link: "/products", name: "products" },

]
const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

apps.use(express.static(path.join(__dirname, "public")));
apps.set("views", "./src/view");
apps.set("view engine", "ejs");

apps.get("/", (req, res) => {
    res.render("index", { text: "hello 😊" })
})

apps.use("/category", categoryRouter(nav));
apps.use("/products", productsRouter(nav));

apps.listen(port, () => {
    dbConnect()
    console.log("Server Is Running On the Port", port);
}).on("error", error => {
    console.error("Error Starting Server", error)
})

