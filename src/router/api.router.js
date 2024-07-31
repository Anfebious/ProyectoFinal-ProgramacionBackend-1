import express from "express";
import ProductManagerFs from "../ProductsManager.fs.js";
import ProductsManagerMongo from "../ProductsManagerMongo.js";
import CartManagerFs from "../CartManager.fs.js";
import CartManagerMongo from "../CartManagerMongo.js";
import axios from "axios";

// const productManager = new ProductManagerFs()
// const cartManager = new CartManagerFs()
const productManager = new ProductsManagerMongo()
const cartManager = new CartManagerMongo()

const apiRouter = express.Router();

apiRouter.get("/products", async (req, res) => {
    const limit = req.query.limit ? parseInt(req.query.limit) : 10;
    const page = req.query.page ? parseInt(req.query.page) : 1;
    const sort = req.query.sort ? req.query.sort : {};
    const query = req.query.query ? JSON.parse(req.query.query) : {}; 
    const products = await productManager.getProducts(query, sort, limit, page)
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify(products))
})

apiRouter.get("/products/:pid", async (req, res) => {
    try {
        const products = await productManager.getProductsById(req.params.pid);
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(products))
    } catch (error) {
        return res.status(400).send({status: "error", error: error.message})
    }
})

apiRouter.post("/products", (req, res) => {
    const product = req.body;
    try {
        productManager.addProduct(product);
        emitProductUpdates(req.app.get("socketServer"));
        return res.status(200).send({status: "success", message: "product created"})
    } catch (productError) {
        return res.status(400).send({status: "error", error: productError.message})
    }
})

apiRouter.delete("/products/:pid", (req, res) => {
    try {
        productManager.removeProductsById(req.params.pid);
        emitProductUpdates(req.app.get("socketServer"));
        return res.status(200).send({status: "success", message: "product deleted"})
    } catch (productError) {
        return res.status(400).send({status: "error", error: productError.message})
    }
})

apiRouter.put("/products/:pid", (req, res) => {
    try {
        productManager.updateProductsById(req.params.pid, req.body);
        emitProductUpdates(req.app.get("socketServer"));
        return res.status(200).send({status: "success", message: "product updated"})
    } catch (productError) {
        return res.status(400).send({status: "error", error: productError.message})
    }
})

apiRouter.post("/carts", (req, res) => {
    try {
        cartManager.addCart();
        return res.status(200).send({status: "success", message: "cart created"})
    } catch (productError) {
        return res.status(400).send({status: "error", error: productError.message})
    }
})

apiRouter.get("/carts/:cid", async (req, res) => {
    try {
        const carts = await cartManager.getCartById(req.params.cid);
        res.setHeader("Content-Type", "application/json");
        res.send(JSON.stringify(carts))
    } catch (error) {
        return res.status(400).send({status: "error", error: error.message})
    }
})

apiRouter.post("/carts/:cid/products/:pid", async (req, res) => {
    try {
        await cartManager.updateCartById(req.params.cid, req.params.pid);
        emitCartUpdates(req.app.get("socketServer"), req.params.cid);
        return res.status(200).send({status: "success", message: "product added to cart"})
    } catch (productError) {
        return res.status(400).send({status: "error", error: productError.message})
    }
})


apiRouter.delete('/carts/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    try {
        const cart = await cartManager.removeProductFromCart(cid, pid);
        emitCartUpdates(req.app.get("socketServer"), req.params.cid);
        return res.status(200).json({ message: 'Product removed from cart', cart });
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }
});


apiRouter.put('/carts/:cid', async (req, res) => {
    const { cid } = req.params;
    const products = req.body;
    try {
        const cart = await cartManager.updateCartProducts(cid, products);
        emitCartUpdates(req.app.get("socketServer"), req.params.cid);
        return res.status(200).json({ message: 'Cart updated', cart });
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }
});

apiRouter.delete('/carts/:cid', async (req, res) => {
    const { cid } = req.params;
    try {
        const cart = await cartManager.removeAllProductsFromCart(cid);
        emitCartUpdates(req.app.get("socketServer"), req.params.cid);
        return res.status(200).json({ message: 'Products removed from cart', cart });
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }
});

apiRouter.put('/carts/:cid/products/:pid', async (req, res) => {
    const { cid, pid } = req.params;
    const body = req.body;    
    try {
        const cart = await cartManager.updateProductQuantityByCartIdAndProductId(cid, pid, body);
        emitCartUpdates(req.app.get("socketServer"), req.params.cid);
        return res.status(200).json({ message: 'Product quantity updated', cart });
    } catch (error) {
        return res.status(404).json({ error: error.message });
    }
});

async function emitProductUpdates(socketServer) {
    const products = await axios.get("http://localhost:8080/api/products") 
    socketServer.emit("products", products.data)
}

async function emitCartUpdates(socketServer, cid) {
    const cart = await axios.get("http://localhost:8080/api/carts/" + cid) 
    socketServer.emit("carts", cart.data)
}

export default apiRouter
