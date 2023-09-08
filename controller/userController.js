const userModel = require("../model/userModel")
const couponModel = require("../model/couponModel")
const appointmentModel = require("../model/appointmentModel")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config()
const paypal = require("paypal-rest-sdk")



paypal.configure({
    'mode': 'live',
    'client_id': process.env.CLIENT_ID,
    'client_secret': process.env.CLIENT_SECRET
});

const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const express = require('express')
const app = express()
const path = require('path')
app.use(express.static("uploads"))

const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require("cloudinary").v2;

const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'article',
        format: async (req, file) => 'jpg'
    }
});
const upload = multer({ storage: storage }).single("image")

module.exports.register_user = async (req, res) => {
    let { fullName, email, password, phone } = req.body;

    try {
        let user = await userModel.findOne({ email });
        if (user) {
            return res.send({ error: "The email is already registered" });
        } else {
            let hashPassword = await bcrypt.hashSync(password, 10);
            password = hashPassword;

            const otpGenerate = Math.floor(Math.random() * 90000) + 10000;
            user = await userModel.create({ fullName, email, password, phone, otp: otpGenerate });

            const mailTransporter = nodemailer.createTransport({
                service: "gmail",
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.EMAIL_ADMIN,
                    pass: process.env.PASS_EMAIL_ADMIN
                }
            });

            let info = {
                from: process.env.EMAIL_ADMIN,
                to: email,
                subject: "Thanks for sign up for Essence of Being. Use this following code to verify your email",
                html: `

            <!DOCTYPE html>
            <html lang="en">
            
            <!DOCTYPE html>
            <html lang="en">
            
            <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <style>
            
                  
                * {
                padding: 0px;
                margin: 0px;
                border: none;
                outline: none;
                -webkit-box-sizing: border-box;
                        box-sizing: border-box;
                text-decoration: none;
                list-style: none;
                font-family: "Inter", sans-serif;
            }
            body {
                height: 100vh;
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-align: center;
                    -ms-flex-align: center;
                        align-items: center;
                -webkit-box-pack: center;
                    -ms-flex-pack: center;
                        justify-content: center;
            }
            .container {
                text-align: center;
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-orient: vertical;
                -webkit-box-direction: normal;
                    -ms-flex-direction: column;
                        flex-direction: column;
                width: 95%;
                max-width: 630px;
                background: #f6fbff;
                padding: 110px 20px;
                border-radius: 25px;
                border: #0084ff 1px solid;
                position: relative;
                overflow: hidden;
                margin: auto;
            }
            .card {
                display: grid;
                grid-template-columns: 1fr;
                gap: 20px;
                position: relative;
                z-index: 2;
                margin: auto;
            }
            .verify-button {
                padding: 10px;
                background: #0084ff;
                border-radius: 5px;
                width: -webkit-fit-content;
                width: -moz-fit-content;
                width: fit-content;
                -ms-flex-negative: 0;
                    flex-shrink: 0;
                height: 100%;
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-align: center;
                    -ms-flex-align: center;
                        align-items: center;
                font-weight: 500;
                padding: 15px;
                border-radius: 10px;
                margin: auto;
                text-transform: capitalize;
                cursor: pointer;
                padding: 15px 40px;
                  
                      height: fit-content;
            }
            .social-media {
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-pack: center;
                -ms-flex-pack: center;
                justify-content: center;
                -webkit-box-align: center;
                -ms-flex-align: center;
                align-items: center;
                gap: 10px;
                margin-top: 20px;
                position: relative;
            
                margin: auto;
                margin: 20px auto;
            }
            
            
            
            .icon-a-card img {
                height: 24px;
                filter: invert(1);
                -webkit-filter: invert(1);
            }
            
            .icon-a-card {
                width: 60px;
                height: 60px;
                background-color: #0084ff;
                border-radius: 50%;
                -webkit-border-radius: 50%;
                -moz-border-radius: 50%;
                -ms-border-radius: 50%;
                -o-border-radius: 50%;
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-pack: center;
                    -ms-flex-pack: center;
                        justify-content: center;
                -webkit-box-align: center;
                    -ms-flex-align: center;
                        align-items: center;
                margin: auto;
                margin-top: 20px;
                margin: 0;
            }
            
            .p-message {
                max-width: 620px;
                margin: auto;
            }
         
            .verify-button {
                color: white !important;
                cursor: pointer;
            }

            .a-link-website {

color: #0084ff !important;
            }

            .p-message a {
                color: "#000000 !important"
            }
            
            .h1-text {
                text-align: center;
                font-size: 66px;
            
              
                padding-left: var(--padding);
                padding-right: var(--padding);
                color:#0084ff;
            
                position: relative;
                z-index: 1;
                margin-bottom: 10px;
            }
            
            p {
                font-weight: 500;
            }
            
            @media (max-width:700px) {
                .h1-text {
                    font-size: 36px;
                }
            }
            
            .container::after {
                content: "";
                width: 90%;
                height: 40%;
                background-color: #0084ff;
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translate(-50%);
                -webkit-transform: translate(-50%);
                -moz-transform: translate(-50%);
                -ms-transform: translate(-50%);
                -o-transform: translate(-50%);
            
                z-index: 0;
                border-radius: 345px 345px 0 0;
                -webkit-filter: blur(177px);
                        filter: blur(177px);
                bottom: -160px;
            }
                  .margin{
                  margin: 10px auto; 
                  }
                </style>
                <!-- ======================== Google Font ======================== -->
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
                    rel="stylesheet">
            </head>
            
            <body>
                <div class="container">
                    <div class="card">
            
                        <h1 class="h1-text">Essence of Being</h1>
            
                        <h1 class="margin" >Hello, ${fullName} </h1>
                        <p class="p-message margin">
                        Thanks for sign up for <b> <a target="_blank" class="a-link-website" href="https://essenceob.com">Essence of Being</a> </b>. Use this following code to verify your email:
                        </p>
        
                        <a class="verify-button margin" target="_blank" rel="noopener noreferrer">${otpGenerate.toString()}</a>
                    </div>
            
                </div>
            
            </body>
            
            </html>`
            };

            mailTransporter.sendMail(info, async (err) => {
                if (err) {
                    console.log(err);
                } else {

                    user.otp = otpGenerate;
                    await user.save();
                }
            });

            res.send({ success: "Account registered, please verify your email with Code" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Failed to register the user" });
    }
};

module.exports.register_submit = async (req, res) => {
    let { otp, email } = req.body;

    try {
        let user = await userModel.findOne({ email });
        if (!user) {
            return res.status(404).send({ error: "User not found" });
        }

        if (user.otp == otp) {
            user.isVerified = true;
            await user.save();
            return res.send({ success: "Your account has been registered" });
        } else {
            return res.send({ error: "The Code is not Correct" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ error: "Failed to create the account" });
    }
};

module.exports.register_resend_otp = async (req, res) => {
    let { email } = req.body;

    try {
        let user = await userModel.findOne({ email });
        if (user) {
            let fullName = user.fullName;
            const otpGenerate = Math.floor(Math.random() * 90000) + 10000;
            const mailTransporter = nodemailer.createTransport({
                service: "gmail",
                host: "smtp.gmail.com",
                port: 465,
                secure: true,
                auth: {
                    user: process.env.EMAIL_ADMIN,
                    pass: process.env.PASS_EMAIL_ADMIN
                }
            });

            let info = {
                from: process.env.EMAIL_ADMIN,
                to: email,
                subject: "Use this following code to verify your email in https://essenceob.com website",
                html: `

            <!DOCTYPE html>
            <html lang="en">
            
            <!DOCTYPE html>
            <html lang="en">
            
            <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <style>
            
                  
                * {
                padding: 0px;
                margin: 0px;
                border: none;
                outline: none;
                -webkit-box-sizing: border-box;
                        box-sizing: border-box;
                text-decoration: none;
                list-style: none;
                font-family: "Inter", sans-serif;
            }
            body {
                height: 100vh;
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-align: center;
                    -ms-flex-align: center;
                        align-items: center;
                -webkit-box-pack: center;
                    -ms-flex-pack: center;
                        justify-content: center;
            }
            .container {
                text-align: center;
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-orient: vertical;
                -webkit-box-direction: normal;
                    -ms-flex-direction: column;
                        flex-direction: column;
                width: 95%;
                max-width: 630px;
                background: #f6fbff;
                padding: 110px 20px;
                border-radius: 25px;
                border: #0084ff 1px solid;
                position: relative;
                overflow: hidden;
                margin: auto;
            }
            .card {
                display: grid;
                grid-template-columns: 1fr;
                gap: 20px;
                position: relative;
                z-index: 2;
                margin: auto;
            }
            .verify-button {
                padding: 10px;
                background: #0084ff;
                border-radius: 5px;
                width: -webkit-fit-content;
                width: -moz-fit-content;
                width: fit-content;
                -ms-flex-negative: 0;
                    flex-shrink: 0;
                height: 100%;
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-align: center;
                    -ms-flex-align: center;
                        align-items: center;
                font-weight: 500;
                padding: 15px;
                border-radius: 10px;
                margin: auto;
                text-transform: capitalize;
                cursor: pointer;
                padding: 15px 40px;
                  
                      height: fit-content;
            }
            .social-media {
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-pack: center;
                -ms-flex-pack: center;
                justify-content: center;
                -webkit-box-align: center;
                -ms-flex-align: center;
                align-items: center;
                gap: 10px;
                margin-top: 20px;
                position: relative;
            
                margin: auto;
                margin: 20px auto;
            }
            
            
            
            .icon-a-card img {
                height: 24px;
                filter: invert(1);
                -webkit-filter: invert(1);
            }
            
            .icon-a-card {
                width: 60px;
                height: 60px;
                background-color: #0084ff;
                border-radius: 50%;
                -webkit-border-radius: 50%;
                -moz-border-radius: 50%;
                -ms-border-radius: 50%;
                -o-border-radius: 50%;
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-pack: center;
                    -ms-flex-pack: center;
                        justify-content: center;
                -webkit-box-align: center;
                    -ms-flex-align: center;
                        align-items: center;
                margin: auto;
                margin-top: 20px;
                margin: 0;
            }
            
            .p-message {
                max-width: 620px;
                margin: auto;
            }
         
            .verify-button {
                color: white !important;
                cursor: pointer;
            }

            .a-link-website {

color: #0084ff !important;
            }

            .p-message a {
                color: "#000000 !important"
            }
            
            .h1-text {
                text-align: center;
                font-size: 66px;
            
              
                padding-left: var(--padding);
                padding-right: var(--padding);
                color:#0084ff;
            
                position: relative;
                z-index: 1;
                margin-bottom: 10px;
            }
            
            p {
                font-weight: 500;
            }
            
            @media (max-width:700px) {
                .h1-text {
                    font-size: 36px;
                }
            }
            
            .container::after {
                content: "";
                width: 90%;
                height: 40%;
                background-color: #0084ff;
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translate(-50%);
                -webkit-transform: translate(-50%);
                -moz-transform: translate(-50%);
                -ms-transform: translate(-50%);
                -o-transform: translate(-50%);
            
                z-index: 0;
                border-radius: 345px 345px 0 0;
                -webkit-filter: blur(177px);
                        filter: blur(177px);
                bottom: -160px;
            }
                  .margin{
                  margin: 10px auto; 
                  }
                </style>
                <!-- ======================== Google Font ======================== -->
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
                    rel="stylesheet">
            </head>
            
            <body>
                <div class="container">
                    <div class="card">
            
                        <h1 class="h1-text">Essence of Being</h1>
            
                        <h1 class="margin" >Hello, ${fullName} </h1>
                        <p class="p-message margin">
                        Use this following code to verify your email in  <b> <a target="_blank" class="a-link-website" href="https://essenceob.com">Essence of Being</a> </b> website
                        </p>
        
                        <a class="verify-button margin" target="_blank" rel="noopener noreferrer">${otpGenerate.toString()}</a>
                    </div>
            
                </div>
            
            </body>
            
            </html>`
            };

            mailTransporter.sendMail(info, async (err) => {
                if (err) {
                    console.log(err);
                } else {

                    user.otp = otpGenerate;
                    await user.save();
                }
            });


            res.send({ "success": "Code has been send again!" });
        }
    } catch (error) {
        console.error(error);
        res.status(500).send({ "error": "Failed to register the user" });
    }
};

module.exports.login_user = async (req, res) => {
    let { email, password } = req.body
    let user = await userModel.findOne({ email })
    if (user) {
        let comparePassword = await bcrypt.compare(password, user.password)
        if (comparePassword && user.isVerified) {
            var token = jwt.sign({ id: user._id }, process.env.SECRET_TOKEN);
            return res.send({ token, userId: user._id })
        } else {
            return res.send({ error: "The email or password is incorrect" })
        }
    } else {
        return res.send({ error: "This account has not been created" })

    }
}


module.exports.send_otp_user = async (req, res) => {
    let { email } = req.body;
    let user = await userModel.findOne({ email });

    if (user) {
        let fullName = user.fullName;
        const otpGenerate = Math.floor(Math.random() * 90000) + 10000;
        const mailTransporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_ADMIN,
                pass: process.env.PASS_EMAIL_ADMIN
            }
        });

        let info = {
            from: process.env.EMAIL_ADMIN,
            to: email,
            subject: "Use this following code to verify your email in https://essenceob.com website",
            html: `

            <!DOCTYPE html>
            <html lang="en">
            
            <!DOCTYPE html>
            <html lang="en">
            
            <head>
            <meta charset="UTF-8" />
            <meta http-equiv="X-UA-Compatible" content="IE=edge" />
            <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                <style>
            
                  
                * {
                padding: 0px;
                margin: 0px;
                border: none;
                outline: none;
                -webkit-box-sizing: border-box;
                        box-sizing: border-box;
                text-decoration: none;
                list-style: none;
                font-family: "Inter", sans-serif;
            }
            body {
                height: 100vh;
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-align: center;
                    -ms-flex-align: center;
                        align-items: center;
                -webkit-box-pack: center;
                    -ms-flex-pack: center;
                        justify-content: center;
            }
            .container {
                text-align: center;
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-orient: vertical;
                -webkit-box-direction: normal;
                    -ms-flex-direction: column;
                        flex-direction: column;
                width: 95%;
                max-width: 630px;
                background: #f6fbff;
                padding: 110px 20px;
                border-radius: 25px;
                border: #0084ff 1px solid;
                position: relative;
                overflow: hidden;
                margin: auto;
            }
            .card {
                display: grid;
                grid-template-columns: 1fr;
                gap: 20px;
                position: relative;
                z-index: 2;
                margin: auto;
            }
            .verify-button {
                padding: 10px;
                background: #0084ff;
                border-radius: 5px;
                width: -webkit-fit-content;
                width: -moz-fit-content;
                width: fit-content;
                -ms-flex-negative: 0;
                    flex-shrink: 0;
                height: 100%;
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-align: center;
                    -ms-flex-align: center;
                        align-items: center;
                font-weight: 500;
                padding: 15px;
                border-radius: 10px;
                margin: auto;
                text-transform: capitalize;
                cursor: pointer;
                padding: 15px 40px;
                  
                      height: fit-content;
            }
            .social-media {
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-pack: center;
                -ms-flex-pack: center;
                justify-content: center;
                -webkit-box-align: center;
                -ms-flex-align: center;
                align-items: center;
                gap: 10px;
                margin-top: 20px;
                position: relative;
            
                margin: auto;
                margin: 20px auto;
            }
            
            
            
            .icon-a-card img {
                height: 24px;
                filter: invert(1);
                -webkit-filter: invert(1);
            }
            
            .icon-a-card {
                width: 60px;
                height: 60px;
                background-color: #0084ff;
                border-radius: 50%;
                -webkit-border-radius: 50%;
                -moz-border-radius: 50%;
                -ms-border-radius: 50%;
                -o-border-radius: 50%;
                display: -webkit-box;
                display: -ms-flexbox;
                display: flex;
                -webkit-box-pack: center;
                    -ms-flex-pack: center;
                        justify-content: center;
                -webkit-box-align: center;
                    -ms-flex-align: center;
                        align-items: center;
                margin: auto;
                margin-top: 20px;
                margin: 0;
            }
            
            .p-message {
                max-width: 620px;
                margin: auto;
            }
         
            .verify-button {
                color: white !important;
                cursor: pointer;
            }
            .a-link-website {

                color: #0084ff !important;
                            }
            .p-message a {
                color: "#000000 !important"
            }
            
            .h1-text {
                text-align: center;
                font-size: 66px;
            
              
                padding-left: var(--padding);
                padding-right: var(--padding);
                color:#0084ff;
            
                position: relative;
                z-index: 1;
                margin-bottom: 10px;
            }
            
            p {
                font-weight: 500;
            }
            
            @media (max-width:700px) {
                .h1-text {
                    font-size: 36px;
                }
            }
            
            .container::after {
                content: "";
                width: 90%;
                height: 40%;
                background-color: #0084ff;
                position: absolute;
                bottom: 0;
                left: 50%;
                transform: translate(-50%);
                -webkit-transform: translate(-50%);
                -moz-transform: translate(-50%);
                -ms-transform: translate(-50%);
                -o-transform: translate(-50%);
            
                z-index: 0;
                border-radius: 345px 345px 0 0;
                -webkit-filter: blur(177px);
                        filter: blur(177px);
                bottom: -160px;
            }
                  .margin{
                  margin: 10px auto; 
                  }
                </style>
                <!-- ======================== Google Font ======================== -->
                <link rel="preconnect" href="https://fonts.googleapis.com">
                <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
                    rel="stylesheet">
            </head>
            
            <body>
                <div class="container">
                    <div class="card">
            
                        <h1 class="h1-text">Essence of Being</h1>
            
                        <h1 class="margin" >Hello, ${fullName} </h1>
                        <p class="p-message margin">
                        Use this following code to verify your email in  <b> <a target="_blank" class="a-link-website" href="https://essenceob.com">Essence of Being</a> </b> website
                        </p>
            
                        <a class="verify-button margin" target="_blank" rel="noopener noreferrer">${otpGenerate.toString()}</a>
                    </div>
            
                </div>
            
            </body>
            
            </html>`
        };

        mailTransporter.sendMail(info, async (err) => {
            if (err) {
                console.log(err);
            } else {

                user.otp = otpGenerate;
                await user.save();
            }
        });

        res.send({ success: "Account registered, please verify your email with Code" });
    }
};

module.exports.submit_otp_user = async (req, res) => {
    let { otp, password, email } = req.body
    let user = await userModel.findOne({ email });
    if (user.otp == otp) {
        let hashPassword = await bcrypt.hashSync(password, 10)
        user.password = hashPassword
        await user.save();
        res.send({ "success": "Your password have ben successful change" });
    } else {
        res.send({ "error": "The code you entered is incorrect" });
    }
}


module.exports.update_data_user = async (req, res) => {
    upload(req, res, async (error) => {
        let { id } = req.params;
        let { fullName, phone } = req.body;
        if (error) {
            console.log(error);
        }
        try {

            const { img, fullName, phone } = req.body;
            const imagePath = req.file ? req.file.path : null;
            let data = {
                img: imagePath || img,
                fullName,
                phone
            };
            await userModel.findByIdAndUpdate(id, data);
            res.send({ success: "Your Settings have been change" });
        } catch (error) {
            console.log(error);
            res.send({ error: 'Failed to change the Settings' });
        }
    });
}



module.exports.appointment_user = async (req, res) => {
    let { id } = req.params
    const { idAppointment, dateHour, dateHourEnd, dateDay, category, available, booked, price } = req.body;
    let user = await userModel.findById(id)


    let allAppointment = await appointmentModel.find()

    let appointmentsTrue = user.appointments.some((item) => {
        return item._id.toString() === idAppointment;
    });


    let appointmentModelTrue = allAppointment.some((item) => {
        return item._id.toString() === idAppointment;
    });

    const newAppointment = {
        dateHour,
        dateHourEnd,
        dateDay,
        category,
        available,
        booked
    };

    if (user && appointmentsTrue == false && appointmentModelTrue) {
        user.appointments.push(newAppointment)
        user.save()
        const emailUser = user.email;
        const userName = user.fullName;

        const mailTransporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_ADMIN,
                pass: process.env.PASS_EMAIL_ADMIN
            }
        });
        let info = {
            from: process.env.EMAIL_ADMIN,
            to: emailUser,
            subject: "We encourage you to subscribe to our system ",

            html: `
                    
                    
            <!DOCTYPE html>
<html lang="en">

<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>

      
    * {
    padding: 0px;
    margin: 0px;
    border: none;
    outline: none;
    -webkit-box-sizing: border-box;
            box-sizing: border-box;
    text-decoration: none;
    list-style: none;
    font-family: "Inter", sans-serif;
}
body {
    height: 100vh;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
    -webkit-box-pack: center;
        -ms-flex-pack: center;
            justify-content: center;
}
.container {
    text-align: center;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
        -ms-flex-direction: column;
            flex-direction: column;
    width: 95%;
    max-width: 630px;
    background: #f6fbff;
    padding: 110px 20px;
    border-radius: 25px;
    border: #0084ff 1px solid;
    position: relative;
    overflow: hidden;
    margin: auto;
}
.card {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    position: relative;
    z-index: 2;
    margin: auto;
}
.verify-button {
    padding: 10px;
    background: #0084ff;
    border-radius: 5px;
    width: -webkit-fit-content;
    width: -moz-fit-content;
    width: fit-content;
    -ms-flex-negative: 0;
        flex-shrink: 0;
    height: 100%;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
    font-weight: 500;
    padding: 15px;
    border-radius: 10px;
    margin: auto;
    text-transform: capitalize;
    cursor: pointer;
    padding: 15px 40px;
      
          height: fit-content;
}
.social-media {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    gap: 10px;
    margin-top: 20px;
    position: relative;

    margin: auto;
    margin: 20px auto;
}



.icon-a-card img {
    height: 24px;
    filter: invert(1);
    -webkit-filter: invert(1);
}

.icon-a-card {
    width: 60px;
    height: 60px;
    background-color: #0084ff;
    border-radius: 50%;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    -ms-border-radius: 50%;
    -o-border-radius: 50%;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
        -ms-flex-pack: center;
            justify-content: center;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
    margin: auto;
    margin-top: 20px;
    margin: 0;
}

.p-message {
    max-width: 620px;
    margin: auto;
}

.verify-button {
    color: white !important;
    cursor: pointer;
}

.h1-text {
    text-align: center;
    font-size: 66px;

  
    padding-left: var(--padding);
    padding-right: var(--padding);
    color:#0084ff;

    position: relative;
    z-index: 1;
    margin-bottom: 10px;
}

p {
    font-weight: 500;
}

@media (max-width:700px) {
    .h1-text {
        font-size: 36px;
    }
}

.container::after {
    content: "";
    width: 90%;
    height: 40%;
    background-color: #0084ff;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%);
    -webkit-transform: translate(-50%);
    -moz-transform: translate(-50%);
    -ms-transform: translate(-50%);
    -o-transform: translate(-50%);

    z-index: 0;
    border-radius: 345px 345px 0 0;
    -webkit-filter: blur(177px);
            filter: blur(177px);
    bottom: -160px;
}
      .margin{
      margin: 10px auto; 
      }
    </style>
    <!-- ======================== Google Font ======================== -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
        rel="stylesheet">
</head>

<body>
    <div class="container">
        <div class="card">
            <h1 class="h1-text">Essence of Being</h1>
            <h1 class="margin" >Hello, ${userName} </h1>

            <p class="p-message margin">
            This is to confirm your appointment for a <b>${category}</b> session on :
            </p>
            <p class="p-message margin">
            Date: <b>${dateDay}</b> day
            <br />
            Time: from <b>${dateHour}</b> to <b>${dateHourEnd}</b>
            <br />
            Price: ${price}
            </p>
            <a class="verify-button margin" href="https://us06web.zoom.us/j/89560347006?pwd=QlRMdXFoMHB3WlhrTUZFMys2RjN0QT09v" target="_blank" rel="noopener noreferrer">Link Zoom</a>
            
            <p class="p-message margin">
            We look forward to our session. If you have any questions or need to reschedule, please contact us at 
            
            
          <b>
          <a href="https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=bbudair@essenceob.com" target="_blank"
          rel="noopener noreferrer">bbudair@essenceob.com</a>
          </b>
            
            Best regards,  
            </p>
            <p class="p-message margin">
            <b>Bilal Budair</b>
            </p>
        </div>
    </div>

</body>

</html>

            `
        };
        mailTransporter.sendMail(info, async (err) => {
            if (err) {
                console.log(err);
                res.send({ "error": "message error" });
            } else {
                const mailTransporterAdmin = nodemailer.createTransport({
                    service: "gmail",
                    host: "smtp.gmail.com",
                    port: 465,
                    secure: true,
                    auth: {
                        user: process.env.EMAIL_ADMIN,
                        pass: process.env.PASS_EMAIL_ADMIN
                    }
                });
                let infoAdmin = {
                    from: process.env.EMAIL_ADMIN,
                    to: process.env.EMAIL_ADMIN,
                    subject: "We encourage you to subscribe to our system ",
        
                    html: `
                            
                            
                    <!DOCTYPE html>
        <html lang="en">
        
        <!DOCTYPE html>
        <html lang="en">
        
        <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style>
        
              
            * {
            padding: 0px;
            margin: 0px;
            border: none;
            outline: none;
            -webkit-box-sizing: border-box;
                    box-sizing: border-box;
            text-decoration: none;
            list-style: none;
            font-family: "Inter", sans-serif;
        }
        body {
            height: 100vh;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: center;
                -ms-flex-align: center;
                    align-items: center;
            -webkit-box-pack: center;
                -ms-flex-pack: center;
                    justify-content: center;
        }
        .container {
            text-align: center;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-orient: vertical;
            -webkit-box-direction: normal;
                -ms-flex-direction: column;
                    flex-direction: column;
            width: 95%;
            max-width: 630px;
            background: #f6fbff;
            padding: 110px 20px;
            border-radius: 25px;
            border: #0084ff 1px solid;
            position: relative;
            overflow: hidden;
            margin: auto;
        }
        .card {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
            position: relative;
            z-index: 2;
            margin: auto;
        }
        .verify-button {
            padding: 10px;
            background: #0084ff;
            border-radius: 5px;
            width: -webkit-fit-content;
            width: -moz-fit-content;
            width: fit-content;
            -ms-flex-negative: 0;
                flex-shrink: 0;
            height: 100%;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: center;
                -ms-flex-align: center;
                    align-items: center;
            font-weight: 500;
            padding: 15px;
            border-radius: 10px;
            margin: auto;
            text-transform: capitalize;
            cursor: pointer;
            padding: 15px 40px;
              
                  height: fit-content;
        }
        .social-media {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: center;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            gap: 10px;
            margin-top: 20px;
            position: relative;
        
            margin: auto;
            margin: 20px auto;
        }
        
        
        
        .icon-a-card img {
            height: 24px;
            filter: invert(1);
            -webkit-filter: invert(1);
        }
        
        .icon-a-card {
            width: 60px;
            height: 60px;
            background-color: #0084ff;
            border-radius: 50%;
            -webkit-border-radius: 50%;
            -moz-border-radius: 50%;
            -ms-border-radius: 50%;
            -o-border-radius: 50%;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: center;
                -ms-flex-pack: center;
                    justify-content: center;
            -webkit-box-align: center;
                -ms-flex-align: center;
                    align-items: center;
            margin: auto;
            margin-top: 20px;
            margin: 0;
        }
        
        .p-message {
            max-width: 620px;
            margin: auto;
        }
        
        .verify-button {
            color: white !important;
            cursor: pointer;
        }
        
        .h1-text {
            text-align: center;
            font-size: 66px;
        
          
            padding-left: var(--padding);
            padding-right: var(--padding);
            color:#0084ff;
        
            position: relative;
            z-index: 1;
            margin-bottom: 10px;
        }
        
        p {
            font-weight: 500;
        }
        
        @media (max-width:700px) {
            .h1-text {
                font-size: 36px;
            }
        }
        
        .container::after {
            content: "";
            width: 90%;
            height: 40%;
            background-color: #0084ff;
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translate(-50%);
            -webkit-transform: translate(-50%);
            -moz-transform: translate(-50%);
            -ms-transform: translate(-50%);
            -o-transform: translate(-50%);
        
            z-index: 0;
            border-radius: 345px 345px 0 0;
            -webkit-filter: blur(177px);
                    filter: blur(177px);
            bottom: -160px;
        }
              .margin{
              margin: 10px auto; 
              }
            </style>
            <!-- ======================== Google Font ======================== -->
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
                rel="stylesheet">
        </head>
        
        <body>
            <div class="container">
                <div class="card">
                    <h1 class="h1-text">Essence of Being</h1>
                    <h1 class="margin" >Hello, Bilal Budair the ${userName} is appointment </h1>
        
                    <p class="p-message margin">
                    This is to confirm your appointment for a <b>${category}</b> session on :
                    </p>
                    <p class="p-message margin">
                    Date: <b>${dateDay}</b> day
                    <br />
                    Time: from <b>${dateHour}</b> to <b>${dateHourEnd}</b>
                    <br />
                    Price: ${price}
                    </p>
                    <a class="verify-button margin" href="https://us06web.zoom.us/j/89560347006?pwd=QlRMdXFoMHB3WlhrTUZFMys2RjN0QT09v" target="_blank" rel="noopener noreferrer">Link Zoom</a>
                    
                    <p class="p-message margin">
                    We look forward to our session. If you have any questions or need to reschedule, please contact us at 
        
                  <b>
                  <a href="https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=bbudair@essenceob.com" target="_blank"
                  rel="noopener noreferrer">bbudair@essenceob.com</a>
                  </b>
                    
                    Best regards,  
                    </p>
                    <p class="p-message margin">
                    <b>Bilal Budair</b>
                    </p>
                </div>
            </div>
        
        </body>
        
        </html>
        
                    `
                };
                mailTransporterAdmin.sendMail(infoAdmin, async (err) => {
                    if (err) {
                        console.log(err);
                        res.send({ "error": "message error" });
                    } else {
                        res.send({ "success": "message success" });
                    }
                });
        
            }
        });

       


    }
}

module.exports.free_appointment_user = async (req, res) => {

    let { id } = req.params;
    let user = await userModel.findById(id);
    const { dateHour, dateHourEnd, dateDay, category, available, booked } = req.body;
    const newAppointment = {
        dateHour,
        dateHourEnd,
        dateDay,
        category,
        available,
        booked
    };
    if (user.freeAppointment == true) {
        user.freeAppointment = false;
        user.appointments.push(newAppointment);
        user.save();

        const emailUser = user.email;
        const userName = user.fullName;

        const mailTransporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_ADMIN,
                pass: process.env.PASS_EMAIL_ADMIN
            }
        });

        let info = {
            from: process.env.EMAIL_ADMIN,
            to: emailUser,
            subject: "Your Appointment",

            html: `
                    
                    
            <!DOCTYPE html>
<html lang="en">

<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>

      
    * {
    padding: 0px;
    margin: 0px;
    border: none;
    outline: none;
    -webkit-box-sizing: border-box;
            box-sizing: border-box;
    text-decoration: none;
    list-style: none;
    font-family: "Inter", sans-serif;
}
body {
    height: 100vh;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
    -webkit-box-pack: center;
        -ms-flex-pack: center;
            justify-content: center;
}
.container {
    text-align: center;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
        -ms-flex-direction: column;
            flex-direction: column;
    width: 95%;
    max-width: 630px;
    background: #f6fbff;
    padding: 110px 20px;
    border-radius: 25px;
    border: #0084ff 1px solid;
    position: relative;
    overflow: hidden;
    margin: auto;
}
.card {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    position: relative;
    z-index: 2;
    margin: auto;
}
.verify-button {
    padding: 10px;
    background: #0084ff;
    border-radius: 5px;
    width: -webkit-fit-content;
    width: -moz-fit-content;
    width: fit-content;
    -ms-flex-negative: 0;
        flex-shrink: 0;
    height: 100%;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
    font-weight: 500;
    padding: 15px;
    border-radius: 10px;
    margin: auto;
    text-transform: capitalize;
    cursor: pointer;
    padding: 15px 40px;
      
          height: fit-content;
}
.social-media {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    gap: 10px;
    margin-top: 20px;
    position: relative;

    margin: auto;
    margin: 20px auto;
}



.icon-a-card img {
    height: 24px;
    filter: invert(1);
    -webkit-filter: invert(1);
}

.icon-a-card {
    width: 60px;
    height: 60px;
    background-color: #0084ff;
    border-radius: 50%;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    -ms-border-radius: 50%;
    -o-border-radius: 50%;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
        -ms-flex-pack: center;
            justify-content: center;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
    margin: auto;
    margin-top: 20px;
    margin: 0;
}

.p-message {
    max-width: 620px;
    margin: auto;
}

.verify-button {
    color: white !important;
    cursor: pointer;
}

.h1-text {
    text-align: center;
    font-size: 66px;

  
    padding-left: var(--padding);
    padding-right: var(--padding);
    color:#0084ff;

    position: relative;
    z-index: 1;
    margin-bottom: 10px;
}

p {
    font-weight: 500;
}

@media (max-width:700px) {
    .h1-text {
        font-size: 36px;
    }
}

.container::after {
    content: "";
    width: 90%;
    height: 40%;
    background-color: #0084ff;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%);
    -webkit-transform: translate(-50%);
    -moz-transform: translate(-50%);
    -ms-transform: translate(-50%);
    -o-transform: translate(-50%);

    z-index: 0;
    border-radius: 345px 345px 0 0;
    -webkit-filter: blur(177px);
            filter: blur(177px);
    bottom: -160px;
}
      .margin{
      margin: 10px auto; 
      }
    </style>
    <!-- ======================== Google Font ======================== -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
        rel="stylesheet">
</head>

<body>

    <div class="container">
        <div class="card">
            <h1 class="h1-text">Essence of Being</h1>
            <h1 class="margin" >Hello, ${userName} </h1>

            <p class="p-message margin">
            This is to confirm your appointment for a <b>${category}</b> session on :
            </p>
            <p class="p-message margin">
            Date: <b>${dateDay}</b> day
            <br />
            Time: from <b>${dateHour}</b> to <b>${dateHourEnd}</b>
            <br />
            Price: Free
            </p>
            <a class="verify-button margin" href="https://us06web.zoom.us/j/89560347006?pwd=QlRMdXFoMHB3WlhrTUZFMys2RjN0QT09v" target="_blank" rel="noopener noreferrer">Link Zoom</a>
            
            <p class="p-message margin">
            We look forward to our session. If you have any questions or need to reschedule, please contact us at 
            <b>
            <a href="https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=bbudair@essenceob.com" target="_blank"
            rel="noopener noreferrer">bbudair@essenceob.com</a>
            </b>
            Best regards,  
            </p>
            <p class="p-message margin">
            <b>Bilal Budair</b>
            </p>
        </div>
    </div>

</body>

</html>

            `
        };

        mailTransporter.sendMail(info, async (err) => {
            if (err) {
                console.log(err);
            } else {
                const mailTransporterAdmin = nodemailer.createTransport({
                    service: "gmail",
                    host: "smtp.gmail.com",
                    port: 465,
                    secure: true,
                    auth: {
                        user: process.env.EMAIL_ADMIN,
                        pass: process.env.PASS_EMAIL_ADMIN
                    }
                });
                let infoAdmin = {
                    from: process.env.EMAIL_ADMIN,
                    to: process.env.EMAIL_ADMIN,
                    subject: "We encourage you to subscribe to our system ",
        
                    html: `
                            
                            
                    <!DOCTYPE html>
        <html lang="en">
        
        <!DOCTYPE html>
        <html lang="en">
        
        <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style>
        
              
            * {
            padding: 0px;
            margin: 0px;
            border: none;
            outline: none;
            -webkit-box-sizing: border-box;
                    box-sizing: border-box;
            text-decoration: none;
            list-style: none;
            font-family: "Inter", sans-serif;
        }
        body {
            height: 100vh;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: center;
                -ms-flex-align: center;
                    align-items: center;
            -webkit-box-pack: center;
                -ms-flex-pack: center;
                    justify-content: center;
        }
        .container {
            text-align: center;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-orient: vertical;
            -webkit-box-direction: normal;
                -ms-flex-direction: column;
                    flex-direction: column;
            width: 95%;
            max-width: 630px;
            background: #f6fbff;
            padding: 110px 20px;
            border-radius: 25px;
            border: #0084ff 1px solid;
            position: relative;
            overflow: hidden;
            margin: auto;
        }
        .card {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
            position: relative;
            z-index: 2;
            margin: auto;
        }
        .verify-button {
            padding: 10px;
            background: #0084ff;
            border-radius: 5px;
            width: -webkit-fit-content;
            width: -moz-fit-content;
            width: fit-content;
            -ms-flex-negative: 0;
                flex-shrink: 0;
            height: 100%;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: center;
                -ms-flex-align: center;
                    align-items: center;
            font-weight: 500;
            padding: 15px;
            border-radius: 10px;
            margin: auto;
            text-transform: capitalize;
            cursor: pointer;
            padding: 15px 40px;
              
                  height: fit-content;
        }
        .social-media {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: center;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            gap: 10px;
            margin-top: 20px;
            position: relative;
        
            margin: auto;
            margin: 20px auto;
        }
        
        
        
        .icon-a-card img {
            height: 24px;
            filter: invert(1);
            -webkit-filter: invert(1);
        }
        
        .icon-a-card {
            width: 60px;
            height: 60px;
            background-color: #0084ff;
            border-radius: 50%;
            -webkit-border-radius: 50%;
            -moz-border-radius: 50%;
            -ms-border-radius: 50%;
            -o-border-radius: 50%;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: center;
                -ms-flex-pack: center;
                    justify-content: center;
            -webkit-box-align: center;
                -ms-flex-align: center;
                    align-items: center;
            margin: auto;
            margin-top: 20px;
            margin: 0;
        }
        
        .p-message {
            max-width: 620px;
            margin: auto;
        }
        
        .verify-button {
            color: white !important;
            cursor: pointer;
        }
        
        .h1-text {
            text-align: center;
            font-size: 66px;
        
          
            padding-left: var(--padding);
            padding-right: var(--padding);
            color:#0084ff;
        
            position: relative;
            z-index: 1;
            margin-bottom: 10px;
        }
        
        p {
            font-weight: 500;
        }
        
        @media (max-width:700px) {
            .h1-text {
                font-size: 36px;
            }
        }
        
        .container::after {
            content: "";
            width: 90%;
            height: 40%;
            background-color: #0084ff;
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translate(-50%);
            -webkit-transform: translate(-50%);
            -moz-transform: translate(-50%);
            -ms-transform: translate(-50%);
            -o-transform: translate(-50%);
        
            z-index: 0;
            border-radius: 345px 345px 0 0;
            -webkit-filter: blur(177px);
                    filter: blur(177px);
            bottom: -160px;
        }
              .margin{
              margin: 10px auto; 
              }
            </style>
            <!-- ======================== Google Font ======================== -->
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
                rel="stylesheet">
        </head>
        
        <body>
            <div class="container">
                <div class="card">
                    <h1 class="h1-text">Essence of Being</h1>
                    <h1 class="margin" >Hello, Bilal Budair the ${userName} is appointment </h1>
        
                    <p class="p-message margin">
                    This is to confirm your appointment for a <b>${category}</b> session on :
                    </p>
                    <p class="p-message margin">
                    Date: <b>${dateDay}</b> day
                    <br />
                    Time: from <b>${dateHour}</b> to <b>${dateHourEnd}</b>
                    <br />
                    Price: Free
                    </p>
                    <a class="verify-button margin" href="https://us06web.zoom.us/j/89560347006?pwd=QlRMdXFoMHB3WlhrTUZFMys2RjN0QT09v" target="_blank" rel="noopener noreferrer">Link Zoom</a>
                    
                    <p class="p-message margin">
                    We look forward to our session. If you have any questions or need to reschedule, please contact us at 
        
                  <b>
                  <a href="https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=bbudair@essenceob.com" target="_blank"
                  rel="noopener noreferrer">bbudair@essenceob.com</a>
                  </b>
                    
                    Best regards,  
                    </p>
                    <p class="p-message margin">
                    <b>Bilal Budair</b>
                    </p>
                </div>
            </div>
        
        </body>
        
        </html>
        
                    `
                };
                mailTransporterAdmin.sendMail(infoAdmin, async (err) => {
                    if (err) {
                        console.log(err);
                        res.send({ "error": "message error" });
                    } else {
                        res.send({ "success": "message success" });
                    }
                });
            }
        });

      


        res.send({ "success": "successfully" })
    } else {
        res.send({ "error": "you have a limit in free appointments" })
    }
}

module.exports.coupon_user = async (req, res) => {
    try {
        let { id } = req.params;
        let user = await userModel.findById(id);

        const { dateHour, dateHourEnd, dateDay, category, available, booked, couponCode } = req.body;

        const newAppointment = {
            dateHour,
            dateHourEnd,
            dateDay,
            category,
            available,
            booked
        };

        let companyCoupon = await couponModel.find();

        const foundCoupon = companyCoupon.some((coupon) => {
            return coupon.availableAppointment.some((appointment) => {
                if (appointment && appointment.couponCode == couponCode && appointment.availableNumber > 0 && appointment.category.toLowerCase() == category.toLowerCase()) {
                    return true;
                }
                return false;
            });
        });

        const isCouponCodeUsed = !user.codeCoupon.includes(couponCode);

        if (foundCoupon && isCouponCodeUsed) {

            if (user) {
                user.appointments.push(newAppointment);

                user.codeCoupon.push(couponCode);
                user.save();

                const emailUser = user.email;
                const userName = user.fullName;

                const mailTransporter = nodemailer.createTransport({
                    service: "gmail",
                    host: "smtp.gmail.com",
                    port: 465,
                    secure: true,
                    auth: {
                        user: process.env.EMAIL_ADMIN,
                        pass: process.env.PASS_EMAIL_ADMIN
                    }
                });

                let info = {
                    from: process.env.EMAIL_ADMIN,
                    to: emailUser,
                    subject: "Your Appointment",

                    html: `
                    
                    
                    <!DOCTYPE html>
        <html lang="en">
        
        <!DOCTYPE html>
        <html lang="en">
        
        <head>
        <meta charset="UTF-8" />
        <meta http-equiv="X-UA-Compatible" content="IE=edge" />
        <meta name="viewport" content="width=device-width, initial-scale=1.0" />
            <style>
        
              
            * {
            padding: 0px;
            margin: 0px;
            border: none;
            outline: none;
            -webkit-box-sizing: border-box;
                    box-sizing: border-box;
            text-decoration: none;
            list-style: none;
            font-family: "Inter", sans-serif;
        }
        body {
            height: 100vh;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: center;
                -ms-flex-align: center;
                    align-items: center;
            -webkit-box-pack: center;
                -ms-flex-pack: center;
                    justify-content: center;
        }
        .container {
            text-align: center;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-orient: vertical;
            -webkit-box-direction: normal;
                -ms-flex-direction: column;
                    flex-direction: column;
            width: 95%;
            max-width: 630px;
            background: #f6fbff;
            padding: 110px 20px;
            border-radius: 25px;
            border: #0084ff 1px solid;
            position: relative;
            overflow: hidden;
            margin: auto;
        }
        .card {
            display: grid;
            grid-template-columns: 1fr;
            gap: 20px;
            position: relative;
            z-index: 2;
            margin: auto;
        }
        .verify-button {
            padding: 10px;
            background: #0084ff;
            border-radius: 5px;
            width: -webkit-fit-content;
            width: -moz-fit-content;
            width: fit-content;
            -ms-flex-negative: 0;
                flex-shrink: 0;
            height: 100%;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-align: center;
                -ms-flex-align: center;
                    align-items: center;
            font-weight: 500;
            padding: 15px;
            border-radius: 10px;
            margin: auto;
            text-transform: capitalize;
            cursor: pointer;
            padding: 15px 40px;
              
                  height: fit-content;
        }
        .social-media {
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: center;
            -ms-flex-pack: center;
            justify-content: center;
            -webkit-box-align: center;
            -ms-flex-align: center;
            align-items: center;
            gap: 10px;
            margin-top: 20px;
            position: relative;
        
            margin: auto;
            margin: 20px auto;
        }
        
        
        
        .icon-a-card img {
            height: 24px;
            filter: invert(1);
            -webkit-filter: invert(1);
        }
        
        .icon-a-card {
            width: 60px;
            height: 60px;
            background-color: #0084ff;
            border-radius: 50%;
            -webkit-border-radius: 50%;
            -moz-border-radius: 50%;
            -ms-border-radius: 50%;
            -o-border-radius: 50%;
            display: -webkit-box;
            display: -ms-flexbox;
            display: flex;
            -webkit-box-pack: center;
                -ms-flex-pack: center;
                    justify-content: center;
            -webkit-box-align: center;
                -ms-flex-align: center;
                    align-items: center;
            margin: auto;
            margin-top: 20px;
            margin: 0;
        }
        
        .p-message {
            max-width: 620px;
            margin: auto;
        }
        
        .verify-button {
            color: white !important;
            cursor: pointer;
        }
        
        .h1-text {
            text-align: center;
            font-size: 66px;
        
          
            padding-left: var(--padding);
            padding-right: var(--padding);
            color:#0084ff;
        
            position: relative;
            z-index: 1;
            margin-bottom: 10px;
        }
        
        p {
            font-weight: 500;
        }
        
        @media (max-width:700px) {
            .h1-text {
                font-size: 36px;
            }
        }
        
        .container::after {
            content: "";
            width: 90%;
            height: 40%;
            background-color: #0084ff;
            position: absolute;
            bottom: 0;
            left: 50%;
            transform: translate(-50%);
            -webkit-transform: translate(-50%);
            -moz-transform: translate(-50%);
            -ms-transform: translate(-50%);
            -o-transform: translate(-50%);
        
            z-index: 0;
            border-radius: 345px 345px 0 0;
            -webkit-filter: blur(177px);
                    filter: blur(177px);
            bottom: -160px;
        }
              .margin{
              margin: 10px auto; 
              }
            </style>
            <!-- ======================== Google Font ======================== -->
            <link rel="preconnect" href="https://fonts.googleapis.com">
            <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
            <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
                rel="stylesheet">
        </head>
        
        <body>
        <div class="container">
        <div class="card">
            <h1 class="h1-text">Essence of Being</h1>
            <h1 class="margin" >Hello, ${userName} </h1>

            <p class="p-message margin">
            This is to confirm your appointment for a <b>${category}</b> session on :
            </p>
            <p class="p-message margin">
            Date: <b>${dateDay}</b> day
            <br />
            Time: from <b>${dateHour}</b> to <b>${dateHourEnd}</b>
            <br />
            Price: Corporate Coupon
            </p>
            <a class="verify-button margin" href="https://us06web.zoom.us/j/89560347006?pwd=QlRMdXFoMHB3WlhrTUZFMys2RjN0QT09v" target="_blank" rel="noopener noreferrer">Link Zoom</a>
            
            <p class="p-message margin">
            We look forward to our session. If you have any questions or need to reschedule, please contact us at 
            
            <b>
            <a href="https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=bbudair@essenceob.com" target="_blank"
            rel="noopener noreferrer">bbudair@essenceob.com</a>
            </b>

            Best regards,  
            </p>
            <p class="p-message margin">
            <b>Bilal Budair</b>
            </p>
        </div>
    </div>
        
        </body>
        
        </html>

                    `
                };

                mailTransporter.sendMail(info, async (err) => {
                    if (err) {
                        console.log(err);
                    } else {
                        const mailTransporterAdmin = nodemailer.createTransport({
                            service: "gmail",
                            host: "smtp.gmail.com",
                            port: 465,
                            secure: true,
                            auth: {
                                user: process.env.EMAIL_ADMIN,
                                pass: process.env.PASS_EMAIL_ADMIN
                            }
                        });
                        let infoAdmin = {
                            from: process.env.EMAIL_ADMIN,
                            to: process.env.EMAIL_ADMIN,
                            subject: "We encourage you to subscribe to our system ",

                            html: `
                                    
                                    
                            <!DOCTYPE html>
                <html lang="en">
                
                <!DOCTYPE html>
                <html lang="en">
                
                <head>
                <meta charset="UTF-8" />
                <meta http-equiv="X-UA-Compatible" content="IE=edge" />
                <meta name="viewport" content="width=device-width, initial-scale=1.0" />
                    <style>
                
                      
                    * {
                    padding: 0px;
                    margin: 0px;
                    border: none;
                    outline: none;
                    -webkit-box-sizing: border-box;
                            box-sizing: border-box;
                    text-decoration: none;
                    list-style: none;
                    font-family: "Inter", sans-serif;
                }
                body {
                    height: 100vh;
                    display: -webkit-box;
                    display: -ms-flexbox;
                    display: flex;
                    -webkit-box-align: center;
                        -ms-flex-align: center;
                            align-items: center;
                    -webkit-box-pack: center;
                        -ms-flex-pack: center;
                            justify-content: center;
                }
                .container {
                    text-align: center;
                    display: -webkit-box;
                    display: -ms-flexbox;
                    display: flex;
                    -webkit-box-orient: vertical;
                    -webkit-box-direction: normal;
                        -ms-flex-direction: column;
                            flex-direction: column;
                    width: 95%;
                    max-width: 630px;
                    background: #f6fbff;
                    padding: 110px 20px;
                    border-radius: 25px;
                    border: #0084ff 1px solid;
                    position: relative;
                    overflow: hidden;
                    margin: auto;
                }
                .card {
                    display: grid;
                    grid-template-columns: 1fr;
                    gap: 20px;
                    position: relative;
                    z-index: 2;
                    margin: auto;
                }
                .verify-button {
                    padding: 10px;
                    background: #0084ff;
                    border-radius: 5px;
                    width: -webkit-fit-content;
                    width: -moz-fit-content;
                    width: fit-content;
                    -ms-flex-negative: 0;
                        flex-shrink: 0;
                    height: 100%;
                    display: -webkit-box;
                    display: -ms-flexbox;
                    display: flex;
                    -webkit-box-align: center;
                        -ms-flex-align: center;
                            align-items: center;
                    font-weight: 500;
                    padding: 15px;
                    border-radius: 10px;
                    margin: auto;
                    text-transform: capitalize;
                    cursor: pointer;
                    padding: 15px 40px;
                      
                          height: fit-content;
                }
                .social-media {
                    display: -webkit-box;
                    display: -ms-flexbox;
                    display: flex;
                    -webkit-box-pack: center;
                    -ms-flex-pack: center;
                    justify-content: center;
                    -webkit-box-align: center;
                    -ms-flex-align: center;
                    align-items: center;
                    gap: 10px;
                    margin-top: 20px;
                    position: relative;
                
                    margin: auto;
                    margin: 20px auto;
                }
                
                
                
                .icon-a-card img {
                    height: 24px;
                    filter: invert(1);
                    -webkit-filter: invert(1);
                }
                
                .icon-a-card {
                    width: 60px;
                    height: 60px;
                    background-color: #0084ff;
                    border-radius: 50%;
                    -webkit-border-radius: 50%;
                    -moz-border-radius: 50%;
                    -ms-border-radius: 50%;
                    -o-border-radius: 50%;
                    display: -webkit-box;
                    display: -ms-flexbox;
                    display: flex;
                    -webkit-box-pack: center;
                        -ms-flex-pack: center;
                            justify-content: center;
                    -webkit-box-align: center;
                        -ms-flex-align: center;
                            align-items: center;
                    margin: auto;
                    margin-top: 20px;
                    margin: 0;
                }
                
                .p-message {
                    max-width: 620px;
                    margin: auto;
                }
                
                .verify-button {
                    color: white !important;
                    cursor: pointer;
                }
                
                .h1-text {
                    text-align: center;
                    font-size: 66px;
                
                  
                    padding-left: var(--padding);
                    padding-right: var(--padding);
                    color:#0084ff;
                
                    position: relative;
                    z-index: 1;
                    margin-bottom: 10px;
                }
                
                p {
                    font-weight: 500;
                }
                
                @media (max-width:700px) {
                    .h1-text {
                        font-size: 36px;
                    }
                }
                
                .container::after {
                    content: "";
                    width: 90%;
                    height: 40%;
                    background-color: #0084ff;
                    position: absolute;
                    bottom: 0;
                    left: 50%;
                    transform: translate(-50%);
                    -webkit-transform: translate(-50%);
                    -moz-transform: translate(-50%);
                    -ms-transform: translate(-50%);
                    -o-transform: translate(-50%);
                
                    z-index: 0;
                    border-radius: 345px 345px 0 0;
                    -webkit-filter: blur(177px);
                            filter: blur(177px);
                    bottom: -160px;
                }
                      .margin{
                      margin: 10px auto; 
                      }
                    </style>
                    <!-- ======================== Google Font ======================== -->
                    <link rel="preconnect" href="https://fonts.googleapis.com">
                    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
                    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
                        rel="stylesheet">
                </head>
                
                <body>
                    <div class="container">
                        <div class="card">
                            <h1 class="h1-text">Essence of Being</h1>
                            <h1 class="margin" >Hello, Bilal Budair the ${userName} is appointment </h1>
                
                            <p class="p-message margin">
                            This is to confirm your appointment for a <b>${category}</b> session on :
                            </p>
                            <p class="p-message margin">
                            Date: <b>${dateDay}</b> day
                            <br />
                            Time: from <b>${dateHour}</b> to <b>${dateHourEnd}</b>
                            <br />
                            Price: Corporate Coupon
                            </p>
                            <a class="verify-button margin" href="https://us06web.zoom.us/j/89560347006?pwd=QlRMdXFoMHB3WlhrTUZFMys2RjN0QT09v" target="_blank" rel="noopener noreferrer">Link Zoom</a>
                            
                            <p class="p-message margin">
                            We look forward to our session. If you have any questions or need to reschedule, please contact us at 
                
                          <b>
                          <a href="https://mail.google.com/mail/?view=cm&fs=1&tf=1&to=bbudair@essenceob.com" target="_blank"
                          rel="noopener noreferrer">bbudair@essenceob.com</a>
                          </b>
                            
                            Best regards,  
                            </p>
                            <p class="p-message margin">
                            <b>Bilal Budair</b>
                            </p>
                        </div>
                    </div>
                
                </body>
                
                </html>
                
                            `
                        };
                        mailTransporterAdmin.sendMail(infoAdmin, async (err) => {
                            if (err) {
                                console.log(err);
                                res.send({ "error": "message error" });
                            } else {
                                res.send({ "success": "message success" });
                            }
                        });
                    }
                });

                res.send({ "success": "Coupon code is valid" });
            }

        } else {
            res.send({ "error": "Coupon code is not valid" });
        }
    } catch (error) {
        res.send({ "error": "An error occurred" });
    }
};



module.exports.appointments_Unavailable = async (req, res) => {
    const { id, appointmentId } = req.params;
    const { available } = req.body

    try {
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const appointments = user.appointments;
        const appointmentIndex = appointments.findIndex(
            (appointment) => appointment._id.toString() === appointmentId
        );

        appointments[appointmentIndex].available = available;
        await user.save();

        return res.status(200).json({ success: "Appointment time updated successfully" });
    } catch (error) {
        console.error("Error updating appointment time:", error);
        return res.status(500).json({ error: "An error occurred while updating the appointment time" });
    }

};


module.exports.send_email_message = async (req, res) => {

    let { id } = req.params;
    let { message, link } = req.body;
    let user = await userModel.findById(id);
    if (user) {
        const emailUser = user.email;
        const userName = user.fullName

        const mailTransporter = nodemailer.createTransport({
            service: "gmail",
            host: "smtp.gmail.com",
            port: 465,
            secure: true,
            auth: {
                user: process.env.EMAIL_ADMIN,
                pass: process.env.PASS_EMAIL_ADMIN
            }
        });

        let info = {
            from: process.env.EMAIL_ADMIN,
            to: emailUser,
            subject: message,
            html: `
            
            
            <!DOCTYPE html>
<html lang="en">

<!DOCTYPE html>
<html lang="en">

<head>
<meta charset="UTF-8" />
<meta http-equiv="X-UA-Compatible" content="IE=edge" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <style>

      
    * {
    padding: 0px;
    margin: 0px;
    border: none;
    outline: none;
    -webkit-box-sizing: border-box;
            box-sizing: border-box;
    text-decoration: none;
    list-style: none;
    font-family: "Inter", sans-serif;
}
body {
    height: 100vh;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
    -webkit-box-pack: center;
        -ms-flex-pack: center;
            justify-content: center;
}
.container {
    text-align: center;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-orient: vertical;
    -webkit-box-direction: normal;
        -ms-flex-direction: column;
            flex-direction: column;
    width: 95%;
    max-width: 630px;
    background: #f6fbff;
    padding: 110px 20px;
    border-radius: 25px;
    border: #0084ff 1px solid;
    position: relative;
    overflow: hidden;
    margin: auto;
}
.card {
    display: grid;
    grid-template-columns: 1fr;
    gap: 20px;
    position: relative;
    z-index: 2;
    margin: auto;
}
.verify-button {
    padding: 10px;
    background: #0084ff;
    border-radius: 5px;
    width: -webkit-fit-content;
    width: -moz-fit-content;
    width: fit-content;
    -ms-flex-negative: 0;
        flex-shrink: 0;
    height: 100%;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
    font-weight: 500;
    padding: 15px;
    border-radius: 10px;
    margin: auto;
    text-transform: capitalize;
    cursor: pointer;
    padding: 15px 40px;
      
          height: fit-content;
}
.social-media {
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
    -ms-flex-pack: center;
    justify-content: center;
    -webkit-box-align: center;
    -ms-flex-align: center;
    align-items: center;
    gap: 10px;
    margin-top: 20px;
    position: relative;

    margin: auto;
    margin: 20px auto;
}



.icon-a-card img {
    height: 24px;
    filter: invert(1);
    -webkit-filter: invert(1);
}

.icon-a-card {
    width: 60px;
    height: 60px;
    background-color: #0084ff;
    border-radius: 50%;
    -webkit-border-radius: 50%;
    -moz-border-radius: 50%;
    -ms-border-radius: 50%;
    -o-border-radius: 50%;
    display: -webkit-box;
    display: -ms-flexbox;
    display: flex;
    -webkit-box-pack: center;
        -ms-flex-pack: center;
            justify-content: center;
    -webkit-box-align: center;
        -ms-flex-align: center;
            align-items: center;
    margin: auto;
    margin-top: 20px;
    margin: 0;
}

.p-message {
    max-width: 620px;
    margin: auto;
}

.verify-button {
    color: white !important;
    cursor: pointer;
}

.h1-text {
    text-align: center;
    font-size: 66px;

  
    padding-left: var(--padding);
    padding-right: var(--padding);
	color:#0084ff;

    position: relative;
    z-index: 1;
    margin-bottom: 10px;
}

p {
    font-weight: 500;
}

@media (max-width:700px) {
    .h1-text {
        font-size: 36px;
    }
}

.container::after {
    content: "";
    width: 90%;
    height: 40%;
    background-color: #0084ff;
    position: absolute;
    bottom: 0;
    left: 50%;
    transform: translate(-50%);
    -webkit-transform: translate(-50%);
    -moz-transform: translate(-50%);
    -ms-transform: translate(-50%);
    -o-transform: translate(-50%);

    z-index: 0;
    border-radius: 345px 345px 0 0;
    -webkit-filter: blur(177px);
            filter: blur(177px);
    bottom: -160px;
}
      .margin{
      margin: 10px auto; 
      }
    </style>
    <!-- ======================== Google Font ======================== -->
    <link rel="preconnect" href="https://fonts.googleapis.com">
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
    <link href="https://fonts.googleapis.com/css2?family=Inter:wght@100;200;300;400;500;600;700;800;900&display=swap"
        rel="stylesheet">
</head>

<body>
    <div class="container">
        <div class="card">

            <h1 class="h1-text">Essence of Being</h1>

            <h1 class="margin" >Hello, ${userName} </h1>
            <p class="p-message margin">${message}
            </p>

            <a class="verify-button margin" href="${link ? link : "https://us06web.zoom.us/j/89560347006?pwd=QlRMdXFoMHB3WlhrTUZFMys2RjN0QT09"} target="_blank" rel="noopener noreferrer">Link Zoom</a>
        </div>

    </div>

</body>

</html>
            
            `,
        };

        mailTransporter.sendMail(info, async (err) => {
            if (err) {
                console.log(err);
                res.send({ "error": "message error" });
            } else {
                res.send({ "success": "message success" });
            }
        });
    }
};


module.exports.send_sms_message = async (req, res) => {
    let { id } = req.params;
    let { message } = req.body;
    let user = await userModel.findById(id)
    if (user) {
        const phoneUser = user.phone
        client.messages
            .create({
                body: message,
                from: '+14708354170',
                to: `+${phoneUser}`
            })
            .then(res.send({ "success": "message success" })
            )
    }
};


module.exports.get_user = async (req, res) => {
    let { id } = req.params;
    let user = await userModel.findById(id)
    if (user) {
        res.send(user)
    }
};


module.exports.get_all_user = async (req, res) => {
    let users = await userModel.find()
    res.send(users)
};

module.exports.update_user = async (req, res) => {
    try {
        await userModel.updateMany({ code: '' });
        res.send({ success: 'users was update' });
    } catch (error) {
        res.send({ error: "users was't update" });
    }
};




// payment paypal


module.exports.pay = async (req, res) => {
    let { idUser } = req.params

    let { id, price } = req.body
    let AppointmentAddToUser = await appointmentModel.findById(id)
    let { dateHour, dateHourEnd, dateDay, category, _id } = AppointmentAddToUser


    const create_payment_json = {

        "intent": "sale",
        "payer": {
            "payment_method": "paypal"
        },

        "redirect_urls": {
            "return_url": `${process.env.BASE_URL_API}/success-pay/${idUser}/${encodeURIComponent(_id)}/${encodeURIComponent(dateHour)}/${encodeURIComponent(dateHourEnd)}/${encodeURIComponent(dateDay)}/${encodeURIComponent(category)}`,
            "cancel_url": `${process.env.BASE_URL_API}`
        },
        "transactions": [{
            "item_list": {
                "items": [{
                    "name": "Rasco",
                    "sku": "001",
                    "price": price,
                    "currency": "CAD",
                    "quantity": 1
                }]
            },
            "amount": {
                "currency": "CAD",
                "total": price
            },
            "description": "Rasco Order"
        }]

    };


    paypal.payment.create(create_payment_json, async (error, payment) => {
        if (error) {
            throw error;
        } else {
            for (let i = 0; i < payment.links.length; i++) {
                if (payment.links[i].rel === "approval_url") {
                    let approvalUrl = payment.links[i].href;
                    return res.json({ approvalUrl });
                }
            }
        }
    });
}






