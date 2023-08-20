const express = require('express');
require('dotenv').config()
const app = express();
const mongoose = require('mongoose');
const router = require("./router/route");
const cors = require('cors');
const path = require('path')
const PORT = process.env.PORT || 5000

app.use(express.json());
app.use(cors({origin: '*'}));

app.use("/uploads", express.static(path.join(__dirname, "/uploads")));

mongoose.connect(`mongodb+srv://${process.env.API_USERNAME}:${process.env.API_PASSWORD}@cluster0.x0sffwq.mongodb.net/essence?retryWrites=true&w=majority`).then(() => {
    console.log("Api connected");
}).catch(err => {
    console.log(err);
})

app.get("/", (req, res) => {
    res.send("Rasco")
})
app.use("/api", router)

app.listen(PORT, (req, res) => {
    console.log("server listening on port");
})
