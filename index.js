const express = require('express');
require('dotenv').config()
const app = express();
const mongoose = require('mongoose');
const router = require("./router/route");
const cors = require('cors');
const path = require('path')
const PORT = process.env.PORT || 5000
const cloudinary = require("cloudinary").v2

cloudinary.config({
    cloud_name: process.env.CLOUD_NAME,
    api_key: process.env.CLOUD_API_KEY,
    api_secret: process.env.CLOUD_API_SECRET,
});


// function checkOrigin(req, res, next) {
//     const allowedOrigins = ['https://essenceob.com'];
//     const requestOrigin = req.get('Referer');
//     const requestSecret = req.get('Secret-Key'); 

//     if (allowedOrigins.includes(requestOrigin) && requestSecret === process.env.SECRET_KEY) {
//         return next(); 
//     }
//     return res.status(403).json({ message: 'Access denied.' });
// }

// app.use(checkOrigin);

app.use(express.json());
// app.use(cors({ origin: 'https://essenceob.com' })); 
app.use(cors({ origin: '*' }));

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

mongoose.connect(`mongodb+srv://${process.env.API_USERNAME}:${process.env.API_PASSWORD}@cluster0.x0sffwq.mongodb.net/essence?retryWrites=true&w=majority`).then(() => {
    console.log("Api connected");
}).catch(err => {
    console.log(err);
})

app.get("/", (req, res) => {
    res.send("Rasco New")
})

app.use("/api", router);

app.listen(PORT, () => {
    console.log(`Server listening on port ${PORT}`);
});
