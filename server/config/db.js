const mongoose = require('mongoose');

// dotenv
require("dotenv").config();

const dbConnect = () => {
    mongoose.connect(process.env.MONGO_URL, {
        useNewUrlParser: true,
        useUnifiedTopology: true,
    })
    .then(() => console.log(`Database Connected Successfully`.cyan.underline))
    .catch((error) => {
        console.log(`Error: ${error}`.red.bold);
        process.exit(1);
    });
}

module.exports = dbConnect;