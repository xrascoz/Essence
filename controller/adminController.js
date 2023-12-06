const adminModel = require("../model/adminModel")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config()
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
        folder: 'userProfile',
        format: async (req, file) => 'jpg'
    }
});
const upload = multer({ storage: storage }).single("image");










module.exports.register_admin = async (req, res) => {
    let { fullName, email, password, phone } = req.body;

    try {
        let user = await adminModel.findOne({ email });
        if (user) {
            return res.send({ error: "The email is already registered" });
        } else {
            let hashPassword = await bcrypt.hashSync(password, 10);
            password = hashPassword;

            const otpGenerate = Math.floor(Math.random() * 90000) + 10000;
            user = await adminModel.create({ fullName, email, password, phone, otp: otpGenerate });

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

            a {
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

module.exports.register_submit_admin = async (req, res) => {
    let { otp, email } = req.body;

    try {
        let user = await adminModel.findOne({ email });
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

module.exports.register_resend_otp_admin = async (req, res) => {
    let { email } = req.body;

    try {
        let user = await adminModel.findOne({ email });
        if (user) {
            const fullName = user.fullName
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
         
            a {
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
        res.status(500).send({ error: "Failed to register the user" });
    }
};

module.exports.login_admin = async (req, res) => {
    let { email, password } = req.body
    let user = await adminModel.findOne({ email })
    if (user) {
        let comparePassword = await bcrypt.compare(password, user.password)
        if (comparePassword && user.isVerified) {
            var token = jwt.sign({ id: user._id }, process.env.SECRET_TOKEN);
            return res.send({ token, adminId: user._id })
        } else {
            return res.send({ error: "The email or password is incorrect" })
        }
    } else {
        return res.send({ error: "This account has not been created" })

    }
}

module.exports.send_otp_admin = async (req, res) => {
    let { email } = req.body;
    let user = await adminModel.findOne({ email });


    if (user) {
        const fullName = user.fullName

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
     
        a {
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


module.exports.submit_otp_admin = async (req, res) => {
    let { otp, password, email } = req.body
    let user = await adminModel.findOne({ email });
    if (user.otp == otp) {
        let hashPassword = await bcrypt.hashSync(password, 10)
        user.password = hashPassword
        await user.save();
        res.send({ "success": "Your password have ben successful change" });
    } else {
        res.send({ "error": "The code you entered is incorrect" });
    }
}


module.exports.update_data_admin = async (req, res) => {
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
            await adminModel.findByIdAndUpdate(id, data);
            res.send({ success: "Your Settings have been change" });
        } catch (error) {
            console.log(error);
            res.send({ error: 'Failed to change the Settings' });
        }
    });
}



module.exports.get_admin = async (req, res) => {
    let { id } = req.params;
    let user = await adminModel.findById(id)
    if (user) {
        res.send(user)
    }
};
