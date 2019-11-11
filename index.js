require('dotenv').config();
var express = require("express");
var app = express();
const bodyParser = require("body-parser");
const debugPath = require("./routes/debug");
const googleAuthPath = require("./routes/google");
const localAuthPath = require("./routes/localAuth");
const firebaseAuth = require("./routes/firebaseAuth")
const timetablePath = require("./routes/timetable");
const mongoose = require("mongoose");
const dbURI = "mongodb://"+process.env.DBLOGIN+":"+process.env.DBPASS+"@"+process.env.DBCLUSTER;
const localUserModel = require("./schemas/localUser");
const googleUserModel = require("./schemas/googleUser");
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

function getAuthModel(type) {
    console.log(type);
    if (type === "local") return localUserModel;
    else if (type === "google") return googleUserModel;
}

app.use((req,res,next) => {
    if (req.headers.authorization){
        var token = req.headers.authorization.split(' ')[1];
        var authModel;
        jwt.verify(token,process.env.SECRET_KEY,(err,payload) => {
            if (err) {console.log("err"); next(); }
            if (payload.type) authModel = getAuthModel(payload.type)
            if (payload.id) {
                authModel.findOne({_id:payload.id}, (err,user) =>{
                    if (user) {
                        console.log("User Found!\n" + user);
                        req.user = user;     
                        next();                   
                    }
                    else { console.log("not user"); next(); }
                });
            }
        });
    }
    else next();
})


app.use("/debug",debugPath);
app.use("/auth/google",googleAuthPath);
app.use("/auth/local",localAuthPath);
app.use("/auth/firebase/",firebaseAuth);
app.use("/info",timetablePath);
app.listen(process.env.PORT, function() {
    console.log("Listening localhost:3000");
});

