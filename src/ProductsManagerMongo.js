import { ObjectId } from "mongodb";
import { productModel } from "./models/product.model.js";

export default class ProductsManagerMongo {
    constructor() {
        this.products = productModel;
    }

    async addProduct(data) {
        if (!data.title || !data.description || !data.code || !data.price || !data.stock || !data.category) {
            throw Error("Falta completar algunos campos");
        }
        const product = new this.products({
            title: data.title,
            description: data.description,
            code: data.code,
            price: data.price,
            status: true,
            stock: data.stock,
            category: data.category,
            thumbnail: data.thumbnail,
        });
        return await product.save();
    }

    async getProducts(limit) {
        if (limit) {
            return await this.products.find().limit(limit);
        } else {
            return await this.products.find();
        }
    }

    async getProductsById(id) {
        try {
            const product = await this.products.findById(id);
            if (!product) {
                throw new Error("ID not found");
            }
            return product;
        } catch (error) {
            throw new Error("Failed to get product: " + error.message);
        }
    }

    async removeProductsById(id) {
        const deletedProduct = await this.products.findByIdAndDelete(id);
        if (!deletedProduct) {
            throw Error("Failed to remove product: ID not found");
        }
        return deletedProduct;
    }

    async updateProductsById(id, updatedProduct) {
        const updated = await this.products.findByIdAndUpdate(id, updatedProduct, { new: true });
        if (!updated) {
            throw Error("Failed to update products: ID not found");
        }
        return updated;
    }
}