// require express
const express = require('express');

// dotenv
require('dotenv').config();

// connection
const dbConnect = require('./config/db');

// port
const port = process.env.PORT || 3500

// colors
const colors = require('colors');

// importing routes
const userRoutes = require('./routes/userRoutes');
// const orderRoutes = require('./routes/orderRoutes');

// cors
const cors = require('cors');

dbConnect();
const app = express();
app.use(cors());
app.use(express.json());

// mounting of routes
app.use('/user', userRoutes);
// app.use('/order', orderRoutes);

// app.listen
app.listen(port, () => {
    console.log(`Server started at port: ${port}`.yellow.bold);
})

// '/' route
app.get('/', (req, res) => {
    res.send("App is starting");
})

