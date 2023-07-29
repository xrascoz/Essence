const adminModel = require("../model/adminModel")
const bcrypt = require('bcrypt');
const jwt = require('jsonwebtoken');
const nodemailer = require('nodemailer');


module.exports.register = async (req, res) => {
    let { fullName, email, password, phone } = req.body
    let user = await adminModel.findOne({ email })
    if (user) {
        return res.send({ error: "The email is already registered" })
    } else {
        let hashPassword = await bcrypt.hashSync(password, 10)
        password = hashPassword
        adminModel.create({ fullName, email, password, phone })
        return res.send({ success: "Your account has been registered" })
    }
}

module.exports.login = async (req, res) => {
    let { email, password } = req.body
    let user = await adminModel.findOne({ email })
    if (user) {
        let comparePassword = await bcrypt.compare(password, user.password)
        if (comparePassword) {
            var token = jwt.sign({ id: user._id }, process.env.SECRET_TOKEN);
            return res.send({ token, adminId: user._id })
        } else {
            return res.send("The email or password is incorrect")
        }
    }
}
module.exports.send_otp = async (req, res) => {
    let { email, password } = req.body;
    let user = await adminModel.findOne({ email });

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

module.exports.submit_otp = async (req, res) => {
    let { otp, password } = req.body
    let { id } = req.params
    console.log(id)
    let user = await adminModel.findOne({ _id: id })
    console.log(user.otp)
    if (user.otp == otp) {
        let hashPassword = await bcrypt.hashSync(password, 10)
        await adminModel.findByIdAndUpdate(id, { password: hashPassword })
        console.log(password)
    } else {
        res.send({ "error": "The code you entered is incorrect" });
    }
}

module.exports.appointment = async (req, res) => {
    console.log(req.body)
    let { id } = req.params
    const { dateHour, dateDay, category, available } = req.body;
    let admin = await adminModel.findById(id)
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

// module.exports.appointment_unavailable = async (req, res) => {
//     let { id, appointmentId } = req.params
//     console.log(appointmentId)
//     const { dateHour, dateDay, available } = req.body;
//     let admin = await adminModel.findById(id)

//     if (admin) {
//         let GetAppointmentByIndex = await admin.appointments
//         GetAppointmentByIndex.splice(appointmentId, 1)
//         // let GetAppointmentByIndex = await admin.appointments[appointmentId]
//         // GetAppointmentByIndex.dateHour = dateHour
//         // GetAppointmentByIndex.dateDay = dateDay
//         // GetAppointmentByIndex.available = available
//         admin.save()
//         console.log("successfully");
//     }
// }

module.exports.appointment_unavailable = async (req, res) => {
    let { id, appointmentId } = req.params

    const { dateHour, dateDay, category, available, booked } = req.body;
    let admin = await adminModel.findById(id)

    if (admin) {
        let GetAppointmentByIndex = await admin.appointments
        let GetAppointmentToEdit = GetAppointmentByIndex.find((item) => item._id == appointmentId)
        // console.log(GetAppointmentToEdit)
        // GetAppointmentToEdit.dateHour = dateHour
        // GetAppointmentToEdit.dateDay = dateDay
        // GetAppointmentToEdit.category = category
        // GetAppointmentToEdit.available = available
        GetAppointmentToEdit.booked = booked
        admin.save()
        console.log("successfully");
    }
}

module.exports.appointment_All = async (req, res) => {
    id = "64c252e326c73f00f4a3ec9d"
    let admin = await adminModel.findById(id)

    if (admin) {
        let GetAppointmentByIndex = await admin.appointments
        res.send(GetAppointmentByIndex)
        console.log(GetAppointmentByIndex)
        console.log("successfully");
    }

}