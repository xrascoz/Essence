
const express = require('express')
const router = express.Router()
const { create_blog  , blog_id ,get_blog , get_all_blog} = require("../controller/adminBlogController")
const { register , login , send_otp , submit_otp , appointment , appointment_unavailable , appointment_All} = require("../controller/adminController")
const { register_user , login_user , send_otp_user , submit_otp_user , appointment_user } = require("../controller/userController")

//blog
router.post("/blog", create_blog)
router.get("/blog-home", get_blog)
router.get("/blog", get_all_blog)
router.get("/blog/:id", blog_id)

//admin
router.post("/register", register)
router.post("/login", login)
router.post("/send-otp", send_otp)
router.put("/submit-otp/:id", submit_otp)
router.post("/appointment/:id", appointment)
router.put("/appointment/:id/:appointmentId", appointment_unavailable)
router.get("/appointment", appointment_All)
//user
router.post("/register-user", register_user)
router.post("/login-user", login_user)
router.post("/send-otp-user", send_otp_user)
router.put("/submit-otp-user/:id", submit_otp_user)
router.post("/appointment-user/:id", appointment_user)



module.exports = router