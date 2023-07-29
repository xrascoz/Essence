const userModel = require("../model/userModel")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');


module.exports.register_user = async (req, res) => {
    let { fullName, email, password, phone } = req.body
    let user = await userModel.findOne({ email })
    if (user) {
        return res.send({ error: "The email is already registered" })
    } else {
        let hashPassword = await bcrypt.hashSync(password, 10)
        password = hashPassword
        userModel.create({ fullName, email, password, phone })
        return res.send({ success: "Your account has been registered" })
    }
}

module.exports.login_user = async (req, res) => {
    let { email, password } = req.body
    let user = await userModel.findOne({ email })
    if (user) {
        let comparePassword = await bcrypt.compare(password, user.password)
        if (comparePassword) {
            var token = jwt.sign({ id: user._id }, process.env.SECRET_TOKEN);
            return res.send({ token, userId: user._id })
        } else {
            return res.send("The email or password is incorrect")
        }
    }
}

module.exports.send_otp_user = async (req, res) => {
    let { email, password } = req.body;
    let user = await userModel.findOne({ email });

    if (user) {
        const mailTransporter = nodemailer.createTransport({
            service: "gmail",
            auth: {
                user: "xrascoz@gmail.com",
                pass: "tlerxjkvxnruggsi"
            }
        });

        let otpGenerate = Math.floor(Math.random() * 90000) + 10000;
        let info = {
            from: 'xrascoz@gmail.com',
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
        res.send({ "success": "message success" });
    }
};

module.exports.submit_otp_user = async (req, res) => {
    let { otp, password } = req.body
    let { id } = req.params
    console.log(id)
    let user = await userModel.findOne({ _id: id })
    console.log(user.otp)
    if (user.otp == otp) {
        let hashPassword = await bcrypt.hashSync(password, 10)
        await userModel.findByIdAndUpdate(id, { password: hashPassword })
        console.log(password)
    } else {
        res.send({ "error": "The code you entered is incorrect" });
    }
}

module.exports.appointment_user = async (req, res) => {
    console.log(req.body)
    let { id } = req.params
    const { dateHour, dateDay,category , available, booked } = req.body;
    let admin = await userModel.findById(id)
    const newAppointment = {
        dateHour,
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

