import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

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

productsSchema.plugin(mongoosePaginate)

export const productModel = mongoose.model(productCollection, productsSchema)

