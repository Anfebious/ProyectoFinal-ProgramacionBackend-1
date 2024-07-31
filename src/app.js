import express from "express";
import handlebars from "express-handlebars";
import router from "./router/views.router.js";
import apiRouter from "./router/api.router.js";
import { Server } from "socket.io";
import __dirname from "./utils.js";
import axios from "axios";
import mongoose from "mongoose";


const app = express()

app.engine("handlebars", handlebars.engine())

app.set("views", __dirname + "/views")

app.set("view engine", "handlebars")

app.use(express.json());
app.use(express.urlencoded({extended:true}));
app.use("/", router);
app.use("/api", apiRouter);
app.use(express.static(__dirname + "/public"))

const httpServer = app.listen(8080, ()=> {
    console.log("El servidor esta escuchando el puerto 8080")
})

const socketServer = new Server(httpServer)

socketServer.on("connection", async (socket) => {
    console.log("nuevo cliente conectado")
    try {
        // const products = await axios.get("http://localhost:8080/api/products") 
        // socket.emit("products", products.data)
        // socket.emit("carts")
    } catch (error) {
        console.log(error)
    }
})

app.set('socketServer', socketServer);

mongoose.connect("mongodb+srv://ericdati30:Ciclon3840%25@cluster0.2b3mjna.mongodb.net/?retryWrites=true&w=majority&appName=Cluster0")
.then(() => {
    console.log('Database connection successful');
})
.catch((err) => {
    console.error('Database connection error:', err);
});



