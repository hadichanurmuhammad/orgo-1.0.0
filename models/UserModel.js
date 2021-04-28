const client = require('../modules/mongo')
const Schema = require('mongoose').Schema
const mongoose = require('mongoose');

const UserSchema = new Schema({
    email: {
        type: String,
        index: true,
        unique: true,
        required: true,
        trim: true
    },
    password: {
        type: String,
        required: true
    },
    phone: {
        type: String,
        index: true,
        unique: true,
        required: true,
        trim: true
    },
    name: {
        type: String,
        required: true
    }
})

const ProductSchema = new Schema({
    name: {
        type: String,
        unique: true,
    },
    price: {
        type: String
    }
})

const CartSchema = new Schema({
    price: {
        type: String
    },
    name: {
        type: String,
    },
    count: {
        type: Number
    }
})

const OrderSchema = new Schema({
    productName: {
        type: String
    },
    price: {
        type: String
    }
})

const WishesSchema = new Schema({
    name: {
        type: String,
    }
})

async function UserModel () {
    let db = await client()
    return await db.model('users', UserSchema)
}

async function ProductModel () {
    let db = await client()
    return await db.model('products', ProductSchema)
}

async function CartModel () {
    let db = await client()
    return await db.model('cart', CartSchema)
}

async function OrderModel () {
    let db = await client()
    return await db.model('orders', OrderSchema)
}

async function WishesModel () {
    let db = await client()
    return await db.model('wishes', WishesSchema)
}

async function createUser(email, password, phone, name) {
    const db = await UserModel()
    return await db.create({
        email, password, phone, name
    })
}

async function addCart(name, price, count) {
    const db = await CartModel()
    return await db.create({
        name, price, count
    })
}

async function createOrder(productName, price) {
    const db = await OrderModel()
    return await db.create({
        productName, price
    })
}

async function createWishes(name) {
    const db = await WishesModel()
    return await db.create({
        name
    })
}


async function updateDate(objectId, bdate){
    const db = await UserModel()
    return await db.updateOne({ _id: objectId }, { bdate })
}

async function findUser(login) {
    let object = { email: login }
    
    const db = await UserModel()
    return await db.findOne(object)
}

async function findProduct(name) {
    let object = { name }
    
    const db = await ProductModel()
    return await db.findOne(object)
}

async function findProducts(){
    const db = await ProductModel()
    return await db.find({}, function(err, docs) {
        return docs
    })
}

async function findWishes(){
    const db = await WishesModel()
    return await db.find({}, function(err, docs) {
        return docs
    })
}

async function findCarts(){
    const db = await CartModel()
    return await db.find({}, function(err, docs) {
        return docs
    })
}

async function findOrders(){
    const db = await OrderModel()
    return await db.find({}, function(err, docs) {
        return docs
    })
}

async function deleteCart(name){
    const db = await CartModel()
    return await db.deleteOne({ name })
}




module.exports = {
    createUser,
    updateDate,
    findUser,
    ProductModel,
    findProducts,
    findProduct,
    addCart,
    findCarts,
    deleteCart,
    createOrder,
    findOrders,
    findWishes,
    createWishes
}