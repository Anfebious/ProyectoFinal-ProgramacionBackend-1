import fs from "fs"
import crypto from "crypto"

export default class CartManagerFs {
    constructor() {
        this.carts = []
        this.path = "./src/carts.json"
        this.init()
    }
    init() {
        const exists = fs.existsSync(this.path)
        if (!exists) {
            fs.writeFileSync(this.path, JSON.stringify([]))
            console.log("El archivo fue creado")
        } else {
            console.log("El archivo ya existe")
        }
        this.carts = fs.readFileSync(this.path, "utf-8")
        this.carts = JSON.parse(this.carts)
    }
    addCart() {
        const cart = {
            id: crypto.randomBytes(12).toString("hex"),
            products: [],
        };
        this.carts.push(cart)
        fs.writeFileSync(this.path, JSON.stringify(this.carts, null, 2))
    }
    getCarts(limit) {
        if (limit) {
            return this.carts.slice(0, limit)
        } else {
            return this.carts
        }
    }
    getCartsById(id) {
        const cart = this.carts.find(cart => {
            return cart.id === id
        })
        if (!cart) {
            throw Error("ID not found")
        } else {
            return cart
        }
    }
    removeCartsById(id) {
        try {
            const deleteCart = this.getCartsById(id)
            const carts = this.carts.filter(cart => {
                return cart.id !== deleteCart.id
            })
            this.carts = carts
            fs.writeFileSync(this.path, JSON.stringify(this.carts, null, 2))
            return deleteCart
        } catch (error) {
            throw Error("Failed to remove cart: " + error.message)
        }
    }
    updateCartsById(cartId, productId) {
        let updateFlag = false;
        let updatedCart = {};
        this.carts.forEach((cart) => {
            if (cart.id == cartId) {
                this.updateProductQuantity(cart.products, productId)
                updatedCart = cart;
                updateFlag = true;
            }
        })
        if (!updateFlag) {
            throw Error("Failed to update carts: ID not found")
        }
        fs.writeFileSync(this.path, JSON.stringify(this.carts, null, 2))
        return updatedCart
    }
    updateProductQuantity(products, productId) {
        const foundProduct = products.find((product) => {
            return product.id == productId
        }) 
        if(foundProduct != undefined) {
            foundProduct.quantity += 1
        } else {
            products.push({id: productId, quantity: 1})
        }
    }
}