import express from "express";
import axios from "axios";
import { productModel } from "../models/product.model.js";

const router = express.Router();

router.get("/", async (req, res) => {
    const products = await axios.get("http://localhost:8080/api/products")
    res.render("home", {products: products.data.docs}) //Se usa docs porque utiliza paginate.
})

router.get("/products", async (req, res) => {
    const products = await axios.get("http://localhost:8080/api/products")
    res.render("index", {products: products.data.docs}) 
})

router.get("/realtimeproducts", async (req, res) => {
    const products = await axios.get("http://localhost:8080/api/products")
    res.render("realTimeProducts", {products: products.data.docs}) 
})

router.get("/cart/:cid", async (req, res) => {
    // const products = await axios.get("http://localhost:8080/api/products")
    // const cartId = req.params.cid
    const cart = await axios.get("http://localhost:8080/api/carts/" + req.params.cid) 
    res.render("cart", {cart: cart.data}) 
})

export default router
