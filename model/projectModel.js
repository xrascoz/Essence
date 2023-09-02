const mongoose = require('mongoose');
const projectSchema = new mongoose.Schema({
    title: { type: "string" },
    summary: { type: "string" },
    content: { type: "string" },
    cover: { type: "string" },
    youtubeLink: { type: "string" }
});

const projectModel =  mongoose.model("project" , projectSchema)
module.exports = projectModel