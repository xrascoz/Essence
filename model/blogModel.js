const mongoose = require('mongoose');
const blogSchema = new mongoose.Schema({
    title: { type: "string" },
    summary: { type: "string" },
    content: { type: "string" },
    cover: { type: "string" }
});

const blogModel =  mongoose.model("blog" , blogSchema)
module.exports = blogModel