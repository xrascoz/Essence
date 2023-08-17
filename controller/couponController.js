const couponModel = require("../model/couponModel")

module.exports.add_new_company = async (req, res) => {
    try {
        let { nameCompany, category, availableNumber } = req.body
        console.log(nameCompany)

        const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
        let result = '';

        for (let i = 0; i < 10; i++) {
            const randomIndex = Math.floor(Math.random() * characters.length);
            result += characters.charAt(randomIndex);
        }
        const couponCode = result;

        const newAppointment = { category, availableNumber, couponCode };
        console.log(newAppointment)
        await couponModel.create({ nameCompany, availableAppointment: [newAppointment] });

        res.send({ "success": "successfully added new company coupon" });
    } catch (error) {
        res.send({ "error": "failed added new company coupon " });
    }
}

module.exports.company = async (req, res) => {

    try {
        let company = await couponModel.find()
        res.send(company);
    } catch (error) {
        res.status(500).send(error.message || "An error occurred");
    }
}

module.exports.add_new_coupon = async (req, res) => {

    let { id } = req.params
    console.log(id)
    let user = await couponModel.findById(id)
    let { category, availableNumber } = req.body

    try {

        if (user) {
            const characters = 'ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz';
            let result = '';
            for (let i = 0; i < 10; i++) {
                const randomIndex = Math.floor(Math.random() * characters.length);
                result += characters.charAt(randomIndex);
            }
            const couponCode = result;

            console.log(user.availableAppointment);
            user.availableAppointment.push({ category, availableNumber, couponCode })
            user.save()
            res.send({ "success": "successfully added new coupon" });
        }

    } catch (error) {
        res.send({ "error": "failed added new coupon " });

    }
}


module.exports.update_coupon = async (req, res) => {
    try {
        const { couponCode } = req.body;
        console.log(couponCode);

        const user = await couponModel.findOne({ "availableAppointment.couponCode": couponCode });

        if (!user) {
            return res.send({ "error": "Coupon not found" });
        }

        const updateCode = user.availableAppointment.find(code => code.couponCode === couponCode);

        if (!updateCode) {
            return res.send({ "error": "Coupon code not found" });
        }

        updateCode.availableNumber -= 1; 

        await user.save();

        res.send({ "success": "Successfully updated coupon" });
    } catch (error) {
        res.send({ "error": "Failed to update coupon" });
    }
};
