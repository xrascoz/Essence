const mongoose = require('mongoose')

const appointmentSchema = new mongoose.Schema({
    dateHour: { type: String, default: "" },
    dateDay: { type: String, default: "" },
    category: { type: String, default: "" },
    available: { type: Boolean, default: true },
    booked: { type: Boolean, default: true }
});

const adminSchema = new mongoose.Schema({
    fullName: { type: 'String' },
    email: { type: 'String' },
    password: { type: 'String' },
    phone: { type: 'String' },
    otp: { type: Number, default: 0 },
    img: { type: 'String' },
    appointments: [appointmentSchema]

})

const adminModel = mongoose.model("admin", adminSchema)

module.exports = adminModel