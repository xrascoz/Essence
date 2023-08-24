
const express = require('express')
const router = express.Router()
const { create_blog, blog_id, get_blog, get_all_blog, update_blog } = require("../controller/adminBlogController")
const { register_admin, register_submit_admin, register_resend_otp_admin, login_admin, send_otp_admin, submit_otp_admin, update_data_admin, get_admin } = require("../controller/adminController")
const { register_user, register_submit, register_resend_otp, login_user, send_otp_user, submit_otp_user, appointment_user, update_data_user, send_email_message, get_user, get_all_user , appointments_Unavailable , free_appointment_user , coupon_user  , update_user , pay , appointment_duplicate } = require("../controller/userController")
const { appointment, appointment_unavailable, appointment_All , appointment_delete } = require("../controller/appointmentController")
const { post_contact, get_contact , delete_contact } = require("../controller/contactController")
const { add_new_company , add_new_coupon , update_coupon  , company} = require("../controller/couponController")

//blog
router.post("/blog", create_blog)
router.get("/blog-home", get_blog)
router.get("/blog", get_all_blog)
router.get("/blog/:id", blog_id)
router.delete("/blog/:id", update_blog)

//admin
router.post("/register-admin", register_admin)
router.post("/register-submit-admin", register_submit_admin)
router.post("/register-resend-otp-admin", register_resend_otp_admin)
router.post("/login-admin", login_admin)
router.post("/send-otp-admin", send_otp_admin)
router.put("/submit-otp-admin", submit_otp_admin)
router.put("/update-data-admin/:id", update_data_admin)
router.get("/admin/:id", get_admin)

// router.post("/appointment/:id", appointment)
// router.put("/appointment/:id/:appointmentId", appointment_unavailable)
// router.get("/appointment", appointment_All)

//user
router.post("/register-user", register_user)
router.post("/register-submit", register_submit)
router.post("/register-resend-otp", register_resend_otp)
router.post("/login-user", login_user)
router.put("/user-update/:id", update_data_user)
router.post("/send-otp-user", send_otp_user)
router.put("/submit-otp-user", submit_otp_user)
router.post("/appointment-user/:id", appointment_user)
router.post("/appointment-duplicate/:id", appointment_duplicate)
router.post("/free-appointment-user/:id", free_appointment_user)
router.post("/coupon-user/:id",coupon_user)
router.post("/send-email-message/:id", send_email_message)
// router.post("/sms/:id", send_sms_message)
router.get("/user/:id", get_user)
router.get("/user", get_all_user)
router.put("/user/appointments/:id/:appointmentId", appointments_Unavailable)
router.post("/user/update-user", update_user)

router.post("/user/pay/:idUser", pay)


//appointment
router.post("/appointment", appointment)
router.put("/appointment/:id", appointment_unavailable)
router.get("/appointment", appointment_All)

router.delete("/appointment/:id", appointment_delete)

// contact
router.post("/contact", post_contact)  
router.get("/contact", get_contact)
router.delete("/contact/:id", delete_contact)

// company
router.get("/company", company)
router.post("/company", add_new_company)
router.post("/company-new/:id", add_new_coupon)
router.post("/update-coupon", update_coupon)


module.exports = router