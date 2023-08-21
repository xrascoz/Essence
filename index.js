const express = require('express');
require('dotenv').config()
const app = express();
const mongoose = require('mongoose');
const router = require("./router/route");
const cors = require('cors');
const path = require('path')
const PORT = process.env.PORT || 5000

const paypal = require("paypal-rest-sdk")




paypal.configure({
    'mod': 'sandbox', // sandbox or live
    'client_id': process.env.CLIENT_ID,
    'client_secret': process.env.CLIENT_SECRET
});

app.use(express.json());
app.use(cors({ origin: '*' }));

// const corsOptions = {
//     origin: 'http://localhost:3000', 
//     methods: 'GET,HEAD,PUT,PATCH,POST,DELETE', 
//     credentials: true, 
//     optionsSuccessStatus: 204, 
// };

// app.use(cors(corsOptions)); 

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




app.post("/pay", (req, res) => {
    const create_payment_json = {
        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },
        "redirect_urls": {
            "return_url": "http://localhost:5000",
            "cancel_url": "http://localhost:5000",
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Rasco",
                    "sku": "001",
                    "price": "25.00",
                    "currency": "CAD",
                    "quantity" : 1
                }]
            },
            "amount": {
                "currency": "CAD",
                "total": "25.00",
            },
            "description" : "Rasco Order"
        }]
    };

    paypal.payment.create(create_payment_json, function (error, payment) {
        if (error) {
            throw error;
        } else {
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === "approval_url") {
                    return res.json({ approvalUrl: payment.links[i].href });

                }
            }
        }
    });
});




app.listen(PORT, (req, res) => {
    console.log("server listening on port");
})
