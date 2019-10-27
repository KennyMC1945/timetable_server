const router = require("express").Router();
const userModel = require('../schemas/localUser');
const jwt = require("jsonwebtoken");
const joi = require("@hapi/joi");

const regScheme = joi.object().keys({
    pass:joi.string().required(),
    name:joi.string().required(),
    mail:joi.string().required(),
    group:joi.string().required()
})

function createLocalJWT(id){
    var payload = {type:"local",id:id};
    var token = jwt.sign(payload,process.env.SECRET_KEY);
    return token;
}

async function isUserExists(usermail){
    var doc = await userModel.findOne({mail:usermail}).exec();
    console.log(doc);
    return doc
}

function registerNewUser(body) {
    var newUser = new userModel({
        pass: body.pass,
        name: body.name,
        mail: body.mail,
        group: body.group
    })
    var savedUser = newUser.save();
    return savedUser;
}

router.post("/register", function(req,res) {
    console.log("POST Request!");
    var validation = regScheme.validate(req.body);
    if (validation.error){
        console.log("Wrong credentials");
        res.json({status:400,msg:"Неверный набор данных"});
        return;
    }
    isUserExists(req.body.mail).then((result)=>{
        if (result) {
            res.json({status:400,msg:"Пользователь с таким email'ом уже есть!"});
            console.log("User exists!");
            return;
        }
        else {    
            var newUser = registerNewUser(req.body);
            var token = createLocalJWT(newUser._id);
            console.log("Register success");
            res.json({status:200,token:token});
        }
    })
});

router.post("/login", function(req, res) {
    console.log(req.headers);
    userModel.findOne({mail:req.body.mail, pass:req.body.pass}, (err, doc) => {
        if (err) throw err;
        if (!doc) res.json({status:400,msg:"Wrong credentials"}); 
        else {
            console.log(doc);
            var token = createLocalJWT(doc._id);
            res.json({status:200,token:token});
        };
    })
});

module.exports = router;