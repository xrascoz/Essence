const userModel = require("../model/userModel")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');
require('dotenv').config()
const client = require('twilio')(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

const express = require('express')
const app = express()
const path = require('path')
app.use(express.static("uploads"))

const multer = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/userProfile")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
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

module.exports.register_submit = async (req, res) => {
    let { otp, email } = req.body;
    console.log(otp)

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

module.exports.submit_otp_user = async (req, res) => {
    let { otp, password, email } = req.body
    console.log(otp)
    let user = await userModel.findOne({ email });
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


module.exports.update_data_user = async (req, res) => {
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
            await userModel.findByIdAndUpdate(id, data);
            res.send({ success: "Your Settings have been change" });
        } catch (error) {
            console.log(error);
            res.send({ error: 'Failed to change the Settings' });
        }
    });
}



module.exports.appointment_user = async (req, res) => {
    console.log(req.body)
    let { id } = req.params
    const { dateHour, dateHourEnd, dateDay, category, available, booked } = req.body;
    let admin = await userModel.findById(id)
    const newAppointment = {
        dateHour,
        dateHourEnd,
        dateDay,
        category,
        available,
        booked
    };
    if (admin) {
        admin.appointments.push(newAppointment)
        admin.save()
        console.log("successfully");
    }
}

module.exports.send_email_message = async (req, res) => {
    let { id } = req.params;
    let { message, link } = req.body;
    console.log(message);
    let user = await userModel.findById(id);
    if (user) {
        const emailUser = user.email;
        console.log(emailUser);
        const mailTransporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: process.env.EMAIL_ADMIN,
                pass: process.env.PASS_EMAIL_ADMIN
            }
        });

        let info = {
            from: process.env.EMAIL_ADMIN,
            to: emailUser,
            subject: message,
            text: `link : ${link}`,
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
    console.log(message)
    let user = await userModel.findById(id)
    if (user) {
        const phoneUser = user.phone
        console.log(phoneUser)
        client.messages
            .create({
                body: message,
                from: '+201011653271',
                to: phoneUser
            })
            .then(res => res.send({ "success": "message success" })
            )

    }
};


module.exports.send_sms_message = async (req, res) => {
    let { id } = req.params;
    let { message } = req.body;
    console.log(message);
    let user = await userModel.findById(id);
    if (user) {
        const phoneUser = user.phone;
        client.messages
            .create({
                body: message,
                from: '+201011653271',
                to: phoneUser
            })
            .then((message) => {
                res.send({ "success": "message success" });
            })
            .catch((error) => {
                console.error('An error occurred while sending the message:', error);
                res.status(400).send({ "error": "An error occurred while sending the message." });
            });

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



module.exports.appointments_Unavailable = async (req, res) => {
    const { id, appointmentId } = req.params;
    const { available } = req.body
    console.log(available)

    try {
        const user = await userModel.findById(id);
        if (!user) {
            return res.status(404).json({ error: "User not found" });
        }

        const appointments = user.appointments;
        const appointmentIndex = appointments.findIndex(
            (appointment) => appointment._id.toString() === appointmentId
        );
        


        console.log(appointments[appointmentIndex])
        appointments[appointmentIndex].available = available;
        await user.save();

        return res.status(200).json({ success: "Appointment time updated successfully" });
    } catch (error) {
        console.error("Error updating appointment time:", error);
        return res.status(500).json({ error: "An error occurred while updating the appointment time" });
    }

};
