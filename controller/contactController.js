const contactModel = require("../model/contactModel")

module.exports.post_contact = async (req, res) => {
    const { name, phone, gmail, message } = req.body

    try {
        await contactModel.create({ name, phone, gmail, message })
        res.json({ success : "The contact was created successfully"})
    }
    catch (err) {
        res.json({ error : "The contact was created successfully"})
    }
}

module.exports.get_contact = async (req, res) => {
    let data = await contactModel.find()
    res.json(data)
}


