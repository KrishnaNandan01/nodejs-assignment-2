const mongoose  = require("mongoose");
const Schema = mongoose.Schema;

const blogSchema = new Schema({
    name:{type:String,},
    email:{type:String,required:true},
    password:{type:String,required:true},
});

const user = mongoose.model("user",blogSchema);

module.exports = user;