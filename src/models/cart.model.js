import mongoose, { Schema } from "mongoose";

const cartCollection = "carts"
const cartsSchema = new mongoose.Schema({
        id: String,
        products: Object,
})

export const cartModel = mongoose.model(cartCollection, cartsSchema)


