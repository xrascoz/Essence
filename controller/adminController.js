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
                auth: {
                    user: process.env.EMAIL_ADMIN,
                    pass: process.env.PASS_EMAIL_ADMIN
                }
            });

            let info = {
                from: process.env.EMAIL_ADMIN,
                to: email,
                subject: "The Code is",
                text: otpGenerate.toString(),
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
    console.log(otp)

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
            const otpGenerate = Math.floor(Math.random() * 90000) + 10000;
            const mailTransporter = nodemailer.createTransport({
                service: "gmail",
                auth: {
                    user: process.env.EMAIL_ADMIN,
                    pass: process.env.PASS_EMAIL_ADMIN
                }
            });

            let info = {
                from: process.env.EMAIL_ADMIN,
                to: email,
                subject: "The Code is",
                text: otpGenerate.toString(),
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
    console.log(user)

    if (user) {

        const otpGenerate = Math.floor(Math.random() * 90000) + 10000;

        const mailTransporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_ADMIN,
                pass: process.env.PASS_EMAIL_ADMIN
            }
        });

        let info = {
            from: process.env.EMAIL_ADMIN,
            to: email,
            subject: "The Code is",
            text: otpGenerate.toString(),
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
    console.log(otp)
    let user = await adminModel.findOne({ email });
    console.log(user.otp)
    if (user.otp == otp) {
        let hashPassword = await bcrypt.hashSync(password, 10)
        user.password = hashPassword
        await user.save();
        console.log(password)
        res.send({ "success": "Your password have ben successful change" });
    } else {
        res.send({ "error": "The code you entered is incorrect" });
    }
}


module.exports.update_data_admin = async (req, res) => {
    upload(req, res, async (error) => {
        let { id } = req.params;
        let { fullName, phone } = req.body;
        console.log(phone);
        if (error) {
            console.log(error);
          
        }
        try {

            const { img, fullName, phone } = req.body;
            const imagePath = req.file ? req.file.path : null;
            console.log(imagePath)
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
