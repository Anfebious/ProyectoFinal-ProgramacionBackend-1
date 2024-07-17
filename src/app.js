import express from "express";
import ProductManagerFs from "./ProductsManager.fs.js";
import ProductsManagerMongo from "./ProductsManagerMongo.js";
import CartManagerFs from "./CartManager.fs.js";
import CartManagerMongo from "./CartManagerMongo.js";
import handlebars from "express-handlebars";
import router from "./router/views.router.js";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import axios from "axios";
import mongoose from "mongoose";


const app = express()

app.engine("handlebars", handlebars.engine())

app.set("views", __dirname + "/views")

app.set("view engine", "handlebars")

// const productManager = new ProductManagerFs()
const productManager = new ProductsManagerMongo()
const cartManager = new CartManagerMongo()
// const cartManager = new CartManagerFs()

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/", router);
console.log(__dirname)
app.use(express.static(__dirname + "/public"))

const httpServer = app.listen(8080, ()=> {
    console.log("El servidor esta escuchando el puerto 8080")
})

const socketServer = new Server(httpServer)

socketServer.on("connection", async (socket) => {
    console.log("nuevo cliente conectado")
    try {
        const products = await axios.get("http://localhost:8080/api/products") 
        socket.emit("products", products.data)
    } catch (error) {
        console.log(error)
    }
})

mongoose.connect("mongodb+srv://ericdati30:Ciclon3840%25@cluster0.2b3mjna.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(() => {
    console.log('Database connection successful');
})
.catch((err) => {
    console.error('Database connection error:', err);
});

async function emitProductUpdates() {
    const products = await axios.get("http://localhost:8080/api/products") 
    socketServer.emit("products", products.data)
}

app.get("/api/products", async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : null
    const products = await productManager.getProducts(limit);
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(products))
})

app.get("/api/products/:pid", async (req, res) => {
    const products = await productManager.getProductsById(req.params.pid);
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(products))
})

app.post("/api/products", (req, res) => {
    const product = req.body;
    try {
        productManager.addProduct(product);
        emitProductUpdates();
        return res.status(200).send({status: "success", message: "product created"})
    } catch (productError) {
        return res.status(400).send({status: "error", error: productError.message})
    }
})

app.delete("/api/products/:pid", (req, res) => {
    try {
        productManager.removeProductsById(req.params.pid);
        emitProductUpdates();
        return res.status(200).send({status: "success", message: "product deleted"})
    } catch (productError) {
        return res.status(400).send({status: "error", error: productError.message})
    }
})

app.put("/api/products/:pid", (req, res) => {
    try {
        productManager.updateProductsById(req.params.pid, req.body);
        emitProductUpdates();
        return res.status(200).send({status: "success", message: "product updated"})
    } catch (productError) {
        return res.status(400).send({status: "error", error: productError.message})
    }
})

app.post("/api/carts", (req, res) => {
    try {
        cartManager.addCart();
        return res.status(200).send({status: "success", message: "cart created"})
    } catch (productError) {
        return res.status(400).send({status: "error", error: productError.message})
    }
})

app.get("/api/carts/:cid", async (req, res) => {
    const carts = await cartManager.getCartById(req.params.cid);
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(carts))
})

app.post("/api/carts/:cid/products/:pid", (req, res) => {
    try {
        cartManager.updateCartById(req.params.cid, req.params.pid);
        return res.status(200).send({status: "success", message: "product added to cart"})
    } catch (productError) {
        return res.status(400).send({status: "error", error: productError.message})
    }
})
