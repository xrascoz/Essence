const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require("cloudinary").v2;
const blogModel = require("../model/blogModel");
const exp = require('constants');

app.use(express.static("uploads/article"));


const storage = new CloudinaryStorage({
    cloudinary: cloudinary,
    params: {
        folder: 'article',
        format: async (req, file) => 'jpg'
    }
});

const upload = multer({ storage: storage }).single("image");

module.exports.create_blog = async (req, res) => {
    upload(req, res, async (error) => {
        if (error) {
            console.log(error);
            return res.status(400).json({ error: 'An error occurred while uploading the file' });
        }
        if (!req.file) {
            return res.status(400).json({ error: 'You must upload the image file' });
        }
        const { content, summary, title } = req.body;
        try {
            await blogModel.create({ cover: req.file.path, content, summary, title });
            res.json({ success: "The blog was created successfully" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'An error occurred while creating the data' });
        }
    });
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
    upload(req, res, async (error) => { 
        if (error) {
            console.log(error);
            return res.status(400).json({ error: 'An error occurred while uploading the file' });
        }

        let { id } = req.params
        const { content, summary, title } = req.body;


        let dataBlog = {}
        if (req.file) {
            dataBlog = { cover: req.file.path, summary, title, content }
        } else {
            dataBlog = { summary, title, content }
        }
        try {
            await blogModel.findByIdAndUpdate(id, dataBlog)
            res.send({ success: "the blog has been Update" })
        } catch (error) {
            console.log(error);
            res.send({ error: "failed to Update blog" })
        }

        
    });
}

module.exports.delete_blog = async (req, res) => {
    let { id } = req.params
    let blogDelete = await blogModel.findByIdAndDelete(id)
    if (blogDelete) {

        res.send({ success: "the blog has been deleted" })
    } else {
        res.send({ error: "failed to delete blog" })

    }
}


