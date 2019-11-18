require('dotenv').config();
var express = require("express");
var app = express();
const bodyParser = require("body-parser");
const debugPath = require("./routes/debug");
const googleAuthPath = require("./routes/google");
const localAuthPath = require("./routes/localAuth");
const firebaseAuth = require("./routes/firebaseAuth")
const timetablePath = require("./routes/timetable");
const userInfoPath = require("./routes/userInfo");
const mongoose = require("mongoose");
const dbURI = "mongodb://"+process.env.DBLOGIN+":"+process.env.DBPASS+"@"+process.env.DBCLUSTER;
const jwt = require("jsonwebtoken");




mongoose.connect(dbURI, {useUnifiedTopology: true,
     useNewUrlParser: true, autoReconnect:true })
.then(() => console.log("Connected to DB!")) 
.catch((err) => console.log(err));

app.use(bodyParser.json());

app.get("/",function(req,res) {
    res.send("Hello, World!");
    console.log("Connection!");
});





app.use("/debug",debugPath);
app.use("/auth/google",googleAuthPath);
app.use("/auth/local",localAuthPath);
app.use("/auth/firebase/",firebaseAuth);
app.use("/info",timetablePath);
app.use("/user",userInfoPath);
app.listen(process.env.PORT, function() {
    console.log("Listening localhost:3000");
});

