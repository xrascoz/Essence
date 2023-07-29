const mongoose = require('mongoose')
const appointmentSchema = new mongoose.Schema({
    dateHour: { type: String, default: "" },
    dateDay: { type: String, default: "" },
    category: { type: String, default: "" },
    available: { type: Boolean, default: true },
    booked: { type: Boolean, default: true }
});

const appointmentModel = mongoose.model("appointment", appointmentSchema)

module.exports = appointmentModel