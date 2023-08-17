const mongoose = require("mongoose");

const appointmentSchema = new mongoose.Schema({
    dateHour: { type: String, default: "" },
    dateDay: { type: String, default: "" },
    dateHourEnd: { type: String, default: "" },
    category: { type: String, default: "" },
    available: { type: Boolean, default: true },
    booked: { type: Boolean, default: false }
});


const userSchema = new mongoose.Schema({
    fullName: { type: 'String' },
    email: { type: 'String' },
    password: { type: 'String' },
    phone: { type: 'String' },
    otp: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    img: { type: 'String', default: "" },
    freeAppointment: { type: Boolean, default: true },
    couponAppointment: { type: Boolean, default: true },
    codeCoupon: [{ type: String, default: "" }],
    appointments: [appointmentSchema]
})

const userModel = mongoose.model("user", userSchema)

module.exports = userModel