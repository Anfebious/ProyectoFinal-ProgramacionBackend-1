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
        return await this.carts.find().limit(limit || 0);
    }

    async getCartById(id) {
        const cart = await this.carts.findById(id).populate('products');
        if (!cart) {
            throw new Error("ID not found");
        }
        return cart;
    }

    async removeCartById(id) {
        const deletedCart = await this.carts.findByIdAndDelete(id);
        if (!deletedCart) {
            throw new Error("Failed to remove cart: ID not found");
        }
        return deletedCart;
    }

    async updateCartById(cartId, productId) {
        const cart = await this.getCartById(cartId);
        if (!cart) {
            throw new Error("Failed to update cart: ID not found");
        }

        this.updateProductQuantity(cart.products, productId);
        cart.markModified('products');
        return await cart.save();
    }

    updateProductQuantity(products, productId) {
        const foundProduct = products.find(product => product.id == productId);
        if (foundProduct) {
            foundProduct.quantity += 1;
        } else {
            const productObjectId = new mongoose.Types.ObjectId(productId);
            products.push({ _id: productId, quantity: 1 });
        }
    }

    async updateCartProducts(cartId, products) {
        const cart = await this.getCartById(cartId);
        cart.products = products.map(product => ({
            _id: product._id,
            quantity: product.quantity
        }));
        return await cart.save();
    }
    
    async updateProductQuantityByCartIdAndProductId(cartId, productId, body) {
        const cart = await this.getCartById(cartId);
        const product = cart.products.find(product => product._id == productId);
        if (!product) {
            throw new Error('Product not found in cart');
        }
        product.quantity = body.quantity;
        cart.markModified('products');
        return await cart.save();
    }
    
    async removeProductFromCart(cartId, productId) {
        const cart = await this.getCartById(cartId);
        cart.products = cart.products.filter(product => product.id !== productId);
        return await cart.save();
    }

    async removeAllProductsFromCart(cartId) {
        const cart = await this.getCartById(cartId);
        cart.products = [];
        return await cart.save();
    }
}


