const mongoose = require('mongoose')

const adminSchema = new mongoose.Schema({
    fullName: { type: 'String' },
    email: { type: 'String' },
    password: { type: 'String' },
    phone: { type: 'String' },
    otp: { type: Number, default: 0 },
    isVerified: { type: Boolean, default: false },
    img: { type: 'String' },

})

const adminModel = mongoose.model("admin", adminSchema)

module.exports = adminModel