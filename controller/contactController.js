const contactModel = require("../model/contactModel")

module.exports.post_contact = async (req, res) => {
    const { name, phone, gmail, message } = req.body

    try {
        await contactModel.create({ name, phone, gmail, message })
        res.json({ success: "The contact was created successfully" })
    }
    catch (err) {
        res.json({ error: "The contact was created successfully" })
    }
}

module.exports.get_contact = async (req, res) => {
    let data = await contactModel.find()
    res.json(data)
}
module.exports.delete_contact = async (req, res) => {
    let { id } = req.params
    let contactDelete = await contactModel.findByIdAndDelete(id)
    if (contactDelete) {
        
        res.json({ success: "The Message was successfully Deleted" })
    } else {
        res.json({ error: "The Message was't Deleted" })
        
    }

}


