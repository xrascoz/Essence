const express = require('express');
const app = express();
const path = require('path');
const multer = require('multer');
const { CloudinaryStorage } = require('multer-storage-cloudinary');
const cloudinary = require("cloudinary").v2;
const projectModel = require("../model/projectModel");
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

module.exports.create_project = async (req, res) => {
    upload(req, res, async (error) => {
        if (error) {
            console.log(error);
            return res.status(400).json({ error: 'An error occurred while uploading the file' });
        }
        if (!req.file) {
            return res.status(400).json({ error: 'You must upload the image file' });
        }
        const { content, summary, title , youtubeLink } = req.body;
        try {
            console.log(req.file.path);
            await projectModel.create({ cover: req.file.path, content, summary, title , youtubeLink });
            res.json({ success: "The project was created successfully" });
        } catch (error) {
            console.log(error);
            res.status(500).json({ error: 'An error occurred while creating the data' });
        }
    });
}

module.exports.project_id = async (req, res) => {
    let { id } = req.params
    let dataProjectId = await projectModel.findById(id)
    res.send(dataProjectId)
}

module.exports.get_project = async (req, res) => {
    let dataProject = await projectModel.find().limit(6)
    res.send(dataProject)
}
module.exports.get_all_project = async (req, res) => {
    let dataProject = await projectModel.find()
    res.send(dataProject)
}

module.exports.update_project = async (req, res) => {
    upload(req, res, async (error) => {
        if (error) {
            console.log(error);
            return res.status(400).json({ error: 'An error occurred while uploading the file' });
        }

        let { id } = req.params
        const { content, summary, title , youtubeLink } = req.body;


        let dataProject = {}
        if (req.file) {
            dataProject = { cover: req.file.path, summary, title, content , youtubeLink }
        } else {
            dataProject = { summary, title, content , youtubeLink}
        }
        try {
            await projectModel.findByIdAndUpdate(id, dataProject)
            res.send({ success: "the project has been Update" })
        } catch (error) {
            console.log(error);
            res.send({ error: "failed to Update project" })
        }
    });
}

module.exports.delete_project = async (req, res) => {
    let { id } = req.params
    let projectDelete = await projectModel.findByIdAndDelete(id)
    if (projectDelete) {
        res.send({ success: "the project has been deleted" })
    } else {
        res.send({ error: "failed to delete project" })
    }
}


