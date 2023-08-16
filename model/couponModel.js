const mongoose = require("mongoose")

const appointmentSchema = new mongoose.Schema({
    category: { type: String, default: "" },
    availableNumber: { type: Number, default: 0  },
    couponCode: { type: String, default: "" }
});

const couponSchema = new mongoose.Schema  ({
    nameCompany: { type: 'String' },
    availableAppointment: [appointmentSchema]
})

const couponModel = mongoose.model("coupon", couponSchema)
module.exports = couponModel