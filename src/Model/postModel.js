const mongoose  = require("mongoose");
const Schema = mongoose.Schema;
const objectId = Schema.objectId;

const blogSchema = new Schema({
    title:{type:String,},
    body:{type:String},
    image:{type:String},
    user:{type:String,ref:"user"}
});

const Blog = mongoose.model("Blog",blogSchema);

module.exports = Blog;