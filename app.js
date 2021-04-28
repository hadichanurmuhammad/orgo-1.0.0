const Express = require('express')
const CookieParser = require('cookie-parser')
const Path = require('path')
const Fs = require('fs')
require('dotenv').config({ path: Path.join(__dirname, ".env")})
const PORT = process.env.PORT
const { generateCrypt, checkCrypt } = require('./modules/bcrypt')
const AuthMiddleware = require('./middlewares/AuthMiddleware')
const { genereteJWTToken } = require('./modules/jwt')
const { createUser, updateDate, findUser, findProduct, findProducts, addCart, findCarts, deleteCart, createOrder, findOrders, createWishes, findWishes } = require('./models/UserModel')
const mongoose = require('mongoose')
const Joi = require('joi')

if(!PORT){
    throw new ReferenceError("PORT is not defined")
}

const app = Express()

// Middlewares
app.use(Express.json())
app.use(Express.urlencoded({ extended: true }))
app.use(CookieParser())

// Settings
app.listen(PORT, () => console.log(`SERVER READY AT http://localhost:${PORT}`))
app.set('view engine', 'ejs')
app.set('views', Path.join(__dirname, "views"))

app.use('/public',Express.static(Path.join(__dirname, "public")))

app.get('/', async (req, res) => {
    res.render('index', {
        products: await findProducts()
    })
})

app.get('/signup', (req, res) => {
    res.render('register')
})

app.post('/signup', async (req, res) => {try {
        const { name, email, password, phone } = await req.body
        const user = await createUser(email, generateCrypt(password), phone, name)
        let token = genereteJWTToken({
            _id: user._id,
            name: user.name,
        })
        res.cookie('token', token).redirect('/')
    }
    catch(e){
        console.log(e);
        if(String(e).includes("duplicate key")){
            e = "Phone or username is not available"
        }
        res.render('register')
    }
})

app.get('/login', (req, res) => {
    res.render('login')
})


app.post('/login', async (req, res) => {
    try {
        let data = req.body
        let user
        user = await findUser(data.email)

        if (!user) {
            throw new Error("User is not found")
        }

        let isTrust = checkCrypt(data.password, user.password)

        if (!isTrust) {
            throw new Error("Password is incorrect")
        }

        let token = genereteJWTToken({
            _id: user._id,
            name: user.name,
        })


        res
            .cookie('token', token)
            .redirect('/')
    } catch (e) {
        console.log(e);
        res.render('login')
    }
})

app.get('/categories', (req, res) => {
    res.render('categories')
})

app.get('/fruits', (req, res) => {
    res.render('fruits')
})

app.get('/vegetables', (req, res) => {
    res.render('vegetables')
})

app.get('/shop', (req, res) => {
    res.render('shop-details')
})

app.get('/comments', (req, res) => {
    res.render('comments')
})

app.post('/cart.html', async (req, res) => {
    let { productCount, productName } = req.body
    if (productCount, productName) {
        let product = await findProduct(productName)
        let price  = product.price * productCount
        await addCart(product.name, price, productCount)
        res.render('cart', {
            price: price,
            name: product.name,
            count: productCount,
            products: await findCarts()
        })
    }
})

app.post('/order', async (req, res) => {
    let { productName, price } = req.body
    deleteCart(productName)
    createOrder(productName, price)
    res.render('buy', {
        products: await findOrders()
    })
})

app.post('/wishes', async (req, res) => {
    let { productName } = req.body
    createWishes(productName)
    res.render('wishes', {
        products: await findWishes()
    })
})

app.get('/wishes', async (req, res) => {
    res.render('wishes', {
        products: await findWishes()
    })
})
