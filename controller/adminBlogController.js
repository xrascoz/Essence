const express = require('express')
const app = express()
const path = require('path')

const blogModel = require("../model/blogModel")

app.use(express.static("uploads/article"))

const multer = require('multer')
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "uploads/article")
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + path.extname(file.originalname));
    }
});

const upload = multer({ storage: storage }).single("image")

module.exports.create_blog = async (req, res) => {
    upload(req, res, async (error) => {
        if (error) {
            console.log(error);
            return res.status(400).json({ error: 'حدث خطأ في تحميل الملف' });
        }
        if (!req.file) {
            return res.status(400).json({ error: 'يجب تحميل ملف الصورة' });
        }
        const { cover, content, summary, title } = req.body
        try {
            console.log(req.file.path);
            await blogModel.create({ cover: req.file.path, content, summary, title })
            res.json({ message: "تم إنشاء المدونة بنجاح" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'حدث خطأ في إنشاء البيانات' });
        }
    })
}


module.exports.blog_id = async (req, res) => {
    let { id } = req.params
    let dataBlogId = await blogModel.findById(id)
    res.send(dataBlogId)
}


module.exports.get_blog = async (req, res) => {
    let dataBlog = await blogModel.find().limit(6)
    res.send(dataBlog)
}
module.exports.get_all_blog = async (req, res) => {
    let dataBlog = await blogModel.find()
    res.send(dataBlog)
}



