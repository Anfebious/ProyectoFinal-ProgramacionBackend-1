import express from "express";
import axios from "axios";
import { productModel } from "../models/product.model.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const products = await axios.get("http://localhost:8080/api/products")
    res.render("home", {products: products.data}) 
})

router.get("/realtimeproducts", (req, res) => {
    // const products = await axios.get("http://localhost:8080/api/products")
    res.render("realTimeProducts") 
})

export default router
