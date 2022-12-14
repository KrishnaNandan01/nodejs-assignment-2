const express = require("express");
const jwt = require('jsonwebtoken');
const Blog = require("../Model/postModel");

const router = express.Router();

router.post("/posts",async (req,res)=>{
    const userBlogs = await Blog.create({
        title:req.body.title,
        body:req.body.body,
        image:req.body.image,
        user:req.user
    })
    try{
        res.json({
            status:"succes",
            userBlogs
        })
    }
    catch(e){
        res.status(400).json({
            status:"failed",
            message:e.message
        })
    }
});

router.get("/posts",async (req,res)=>{
    try {
        const userBlogs = await Blog.find({ user: req.user })
        if (userBlogs.length) {
            res.json({
                status: "succes",
                userBlogs
            })
        }
        else {
            res.status(404).json({
                status: "failed",
                message: "post not available"
            })
        }
    }
    catch(e){
        res.status(400).json({
            status:"failed",
            message:e.message
        })
    }
});

router.put("/posts/:id",async (req,res)=>{
    try {
        const userBlogs = await Blog.find({_id:req.params.id})
        if (userBlogs.length) {
            await Blog.updateOne({_id:req.params.id},{
                title:req.body.title,
                body:req.body.body,
                image:req.body.image,
                user:req.user
            });
            const updateBlogs = await Blog.findOne({_id:req.params.id})
            res.json({
                status: "succes",
                updateBlogs
            })
        }
        else {
            res.status(404).json({
                status: "failed",
                message: "post not available"
            })
        }

    }
    catch(e){
        res.status(400).json({
            status:"failed",
            message:e.message
        })
    }
});

router.delete("/posts/:id",async(req,res)=>{
    const userBlogs = await Blog.find({_id:req.params.id});
    if(userBlogs.length){
        await Blog.deleteOne({_id:req.params.id});
        res.json({
            status:"deleted succesfully",
            userBlogs
        })
    }
    else {
        res.status(404).json({
            status: "failed",
            message: "post not available"
        })
    }
})

module.exports = router;