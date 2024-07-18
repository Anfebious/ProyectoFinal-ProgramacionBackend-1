import mongoose, { Schema } from "mongoose";
import mongoosePaginate from "mongoose-paginate-v2";

const cartCollection = "carts";
const cartsSchema = new mongoose.Schema({
    id: String,
    products: [{
        productId: {
            type: Schema.Types.ObjectId,
            ref: "products"
        },
        quantity: {
            type: Number,
            default: 1,
        }
    }],

});

cartsSchema.plugin(mongoosePaginate)

export const cartModel = mongoose.model(cartCollection, cartsSchema)


