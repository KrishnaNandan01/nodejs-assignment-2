const mongoose = require("mongoose");
const express = require("express");
const users = require("../Model/register_login");
const bcrypt = require("bcrypt");
const jwt = require('jsonwebtoken');
const { body, validationResult } = require('express-validator');


const router = express.Router();

router.post("/register", 
body("name").isAlpha(),
body("email").isEmail(),
async (req, res) => {
    try {
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
          }
        const isExists = await users.find({ email: req.body.email });
        if (!isExists.length) {
            bcrypt.hash(req.body.password, 10, async function (err, hash) {
                    const user = await users.create({
                        name: req.body.name,
                        email: req.body.email,
                        password: hash
                    });
                    res.json({
                        status: "success",
                        user
                    });
            });
        }
        else {
            res.status(400).json({
                status: "failed",
                message: "email allredy exists"
            }) 
        }
    }
    catch (e) {
        res.status(400).json({
            status:"failed",
            message:e.message
        });
    }
});

router.post("/login",
body("email").isEmail(),
async(req,res)=>{
    try{
        const errors = validationResult(req);
        if (!errors.isEmpty()) {
            return res.status(400).json({ errors: errors.array() });
        }
        const user = await users.find({email:req.body.email});
        if(!user.length){
            res.status(401).json({
                status:"failed",
                message:"validation failed",
            })
        }
        else{
            bcrypt.compare(req.body.password,user[0].password, async function(err, result) {
                if(!result){
                    res.status(401).json({
                        status:"failed",
                        message:"invalid password"
                    })
                }
                else{
                    const token =jwt.sign({
                        exp: Math.floor(Date.now() / 1000) + (60 * 60),
                        data: user[0].id
                      }, 'secret');
                    res.json({
                        status:"succes",
                        message:"login succesfully",
                        token
                    })
                } 
            });

        }
    } catch (e) {
        res.status(400).json({
            status: "failed",
            message: e.message
        });
    }
}
)

module.exports = router;

