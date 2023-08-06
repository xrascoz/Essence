const mongoose = require("mongoose");

const contactSchema = new mongoose.Schema({
    name: { type: 'string' },
    phone: { type: 'string' },
    gmail: { type: 'string' },
    message: { type: 'string' }
})


const contactModel = mongoose.model('contact', contactSchema)

module.exports = contactModel