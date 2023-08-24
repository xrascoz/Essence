const appointmentModel = require("../model/appointmentModel")

module.exports.appointment = async (req, res) => {
    console.log(req.body)
    const { dateHour, dateHourEnd, dateDay, category, available, booked } = req.body;
    const newAppointment = {
        dateHour,
        dateDay,
        dateHourEnd,
        category,
        available,
        booked
    };
    await appointmentModel.create(newAppointment)
    if (appointmentModel) {
        return res.send({ success: "the Date has been created" });
    } else {
        return res.send({ error: "failed to create date" });
    }
}


module.exports.appointment_unavailable = async (req, res) => {
    let { id } = req.params
    const { booked } = req.body;

    await appointmentModel.findByIdAndUpdate(id, { booked: booked })

    res.send({ "success": "success" })

}

module.exports.appointment_delete = async (req, res) => {
    let { id } = req.params

    await appointmentModel.findByIdAndDelete(id)

    if (appointmentModel) {
        return res.send({ success: "the Date has been Deleted" });
    } else {
        return res.send({ error: "failed to Deleted date" });
    }
}

module.exports.appointment_All = async (req, res) => {
    let appointment_All = await appointmentModel.find()
    res.send(appointment_All)

}