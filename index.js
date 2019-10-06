require('dotenv').config();
var express = require("express");
var app = express();

const mongoose = require("mongoose");
const dbURI = "mongodb://"+process.env.DBLOGIN+":"+process.env.DBPASS+"@"+process.env.DBCLUSTER;
const userModel = require("./schemas/user.js");

mongoose.connect(dbURI, {useUnifiedTopology: true,
     useNewUrlParser: true, autoReconnect:true })
.then(() => console.log("Connected to DB!")) 
.catch((err) => console.log(err));

async function isUserExists(usermail){
    var doc = await userModel.findOne({mail:usermail}).exec();
    console.log(doc);
    return doc
}

app.get("/",function(req,res) {
    res.send("Hello, World!");
    console.log("Connection!");
});

app.get("/getuser", function(req,res) {
    
    isUserExists(req.query.login);//.then((result)=>{console.log(result);});
    res.send("lol");
});

app.post("/newuser", require("./routes/registration").register);
app.get("/login", require("./routes/login").login);
app.listen(process.env.PORT, function() {
    console.log("Listening localhost:3000");
})