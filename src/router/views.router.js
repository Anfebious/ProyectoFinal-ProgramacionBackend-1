import express from "express";
import axios from "axios";
import { productModel } from "../models/product.model.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const products = await axios.get("http://localhost:8080/api/products")
    res.render("home", {products: products.data.docs}) 
})

router.get("/products", async (req, res) => {
    // const products = await axios.get("http://localhost:8080/api/products")
    res.render("index") 
})

router.get("/realtimeproducts", (req, res) => {
    // const products = await axios.get("http://localhost:8080/api/products")
    res.render("realTimeProducts") 
})

router.get("/cart/:cid", async (req, res) => {
    // const products = await axios.get("http://localhost:8080/api/products")
    const cartId = req.params.cid
    res.render("cart", {cartId: cartId}) 
})

export default router
