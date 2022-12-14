const express = require("express");
const mongoose = require("mongoose");
const loginRouter = require("./Routes/register_login");
const blogRouter = require("./Routes/post");
const bodyParser = require("body-parser");
const jwt = require('jsonwebtoken');
const dotenv = require("dotenv");
const port = 3000;

dotenv.config();
const app = express();
mongoose.set('strictQuery', true);
app.use(bodyParser.json());
mongoose.connect(process.env.DATABASE_URL,{ useNewUrlParser: true, useUnifiedTopology: true }, () => {
    console.log("connected to databases");
});
app.use('/posts', (req, res, next) => {
    try {
        const token = req.headers.authorization;
        if (token) {
            const decoded = jwt.verify(token, 'secret');
            req.user = decoded.data;
            next();
        }
        else {
            res.status(401).json({
                status: "failed",
                message: "token are missing"
            })
        }

    } catch (e) {
        res.status(401).json({
            status: "failed",
            message: e.message
        })
    }

})
app.use("/", loginRouter);
app.use("/",blogRouter);


app.listen(port,()=>{
    console.log(`server is running at port ${port}`);
})