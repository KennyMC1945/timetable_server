var express = require("express");
var app = express();

const mongoose = require("mongoose");
const db_conf = require("./db_params.js");
const dbURI = "mongodb://"+db_conf.login+":"+db_conf.pass+"@"+db_conf.URI;
const userModel = require("./user.js");

const joi = require("@hapi/joi");

const regScheme = joi.object().keys({
    login: joi.string().required(),
    pass:joi.string().required(),
    name:joi.string().required(),
    mail:joi.string().required(),
    group:joi.string().required()
})

function registerNewUser(query) {
    var newUser = new userModel({
        login: query.login,
        pass: query.pass,
        name: query.name,
        mail: query.mail,
        group: query.group
    })
    var savedUser = newUser.save();
    return savedUser;
}

mongoose.connect(dbURI, {useUnifiedTopology: true,
     useNewUrlParser: true, autoReconnect:true })
.then(() => console.log("Connected to DB!")) 
.catch((err) => console.log(err));

app.get("/",function(req,res) {
    res.send("Hello, World!");
    console.log("Connection!");
});

app.post("/newuser",function(req,res) {
    console.log("POST Request!");
    var validation = regScheme.validate(req.query);
    if (validation.error){
        console.log("Wrong credentials");
        res.send("Wrong credentials");
    }
    else {
        registerNewUser(req.query);
        console.log("Ok!");
        res.send("Fine");
    }
});

app.listen(3000, function() {
    console.log("Listening localhost:3000");
})