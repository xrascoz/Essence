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
            return res.status(400).json({ error: 'An error occurred while uploading the file' });
        }
        if (!req.file) {
            return res.status(400).json({ error: 'You must upload the image file' });
        }
        const { cover, content, summary, title } = req.body
        try {
            console.log(req.file.path);
            await blogModel.create({ cover: req.file.path, content, summary, title })
            res.json({ success: "The blog was created successfully" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'An error occurred while creating the data' });
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


module.exports.update_blog = async (req, res) => {
    let { id } = req.params
    let blogDelete = await blogModel.findByIdAndDelete(id)
    if (blogDelete) {

        res.send({ success: "the blog has been deleted" })
    } else {
        res.send({ error: "failed to delete blog" })

    }
}


