const mongoose = require('mongoose');

const dbConnect = () => {
    mongoose.connect(process.env.MONGO_URL)
        .then(() => {
            console.log("Database connected successfully");
        })
        .catch( error => {
            console.log("Dtabase connection failed",error)
        })
}

module.exports = dbConnect;