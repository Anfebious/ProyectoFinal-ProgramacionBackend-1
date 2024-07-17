import mongoose, { Schema } from "mongoose";

const productCollection = "products"
const productsSchema = new mongoose.Schema({
        id: String,
        title: String,
        description: String,
        code: String,
        price: Number,
        status: Boolean,
        stock: Number,
        category: String,
        thumbnail: String,
})

export const productModel = mongoose.model(productCollection, productsSchema)

