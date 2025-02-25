const express = require('express')
const app = express()
const bodyParser = require('body-parser')
const mongoose = require('mongoose')
const rateLimit = require('express-rate-limit');
const cors = require('cors')
//require('dotenv/config')
const authjwt = require('./middlewares/jwt')
const { handleAuthErrors } = require('./middlewares/Errorhandler')
require('dotenv').config();

const limiter = rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 100,
    message: 'Too many requests from this IP please try again in 15 mins'
})

// applied rate limiting to all routes 
app.use('/api', limiter);

app.use(cors())
app.options('*', cors())
app.use(bodyParser.json())
app.use(authjwt())
app.use(handleAuthErrors)

app.use("/api/products", require("./routes/productRoutes"));
app.use("/api/users", require("./routes/userRoutes"));
app.use("/api/orders", require("./routes/orderRoutes"));


const connectionString = process.env.CONNECTION_STRING;

mongoose.connect(connectionString)
.then(() => console.log('Database connection is ready...'))
.catch((err) => console.error('Database connection error', err))


app.listen(5000, ()=> {
    console.log('The server is running on http://localhost:5000')
})
