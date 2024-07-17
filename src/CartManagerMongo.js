import mongoose from 'mongoose';
import { cartModel } from './models/cart.model.js'; 

export default class CartManagerMongo {
    constructor() {
        this.carts = cartModel; 
    }

    async addCart() {
        const cart = new this.carts({
            products: [],
        });
        return await cart.save();
    }

    async getCarts(limit) {
        if (limit) {
            return await this.carts.find().limit(limit);
        } else {
            return await this.carts.find();
        }
    }

    async getCartById(id) {
        const cart = await this.carts.findById(id);
        if (!cart) {
            throw Error("ID not found");
        } else {
            return cart;
        }
    }

    async removeCartById(id) {
        const deletedCart = await this.carts.findByIdAndDelete(id);
        if (!deletedCart) {
            throw Error("Failed to remove cart: ID not found");
        }
        return deletedCart;
    }

    async updateCartById(cartId, productId) {
        const cart = await this.carts.findById(cartId);
        if (!cart) {
            throw Error("Failed to update cart: ID not found");
        }
        this.updateProductQuantity(cart.products, productId);
        cart.markModified('products');
        return await cart.save();
    }

    updateProductQuantity(products, productId) {
        const foundProduct = products.find((product) => {
            return product.id == productId
        }); 
        if (foundProduct) {
            foundProduct.quantity += 1;
        } else {
            products.push({id: productId, quantity: 1});
        }
    }
}