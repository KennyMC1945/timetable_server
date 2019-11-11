const router = require("express").Router();
const firebaseUserModel = require("../schemas/uniUser");
const joi = require("@hapi/joi");

const regScheme = joi.object().keys({
    fb_uid:joi.string().required(),
    name:joi.string().required(),
    group:joi.string().required(),
    top_week:joi.number().required()
});

async function isUserExist(userId){
    var user = await firebaseUserModel.findOne({fb_uid:userId}).exec();
    return user;
}

function makeJWT(userInfo){
    var payload = {id:userInfo.fb_uid};
    var token = jwt.sign(payload,process.env.SECRET_KEY);
    return token;
}

function registerNewUser(body) {
    var newUser = new firebaseUserModel({
        fb_uid: body.fb_uid,
        name: body.name,
        top_week: body.top_week,
        group: body.group
    })
    var savedUser = newUser.save();
    return savedUser;
}

router.post("/register", function (req,res) {
    console.log("Registration Connection!")
    var verification = regScheme.validate(req.body)
    if (verification.error){
        res.json({status:400,msg:"Неверный набор данных"});
    } else {
        isUserExist(req.body.fb_uid).then((result)=>{
            if (result) { 
                res.json({status:400, msg:"Пользователь уже зарегестрирован"});
            } else {
                var newUser = registerNewUser(req.body);
                var token = makeJWT(req.body.fb_uid);
                res.json({status:200, token:token,group:req.body.group,name:req.body.name,top_week:req.body.top_week});
            }
        })
    }
});

router.post("/login", function (req,res) {
    console.log("Login connection");
    if (req.body && req.body.fb_uid){
        isUserExist(req.body.fb_uid).then((result)=>{
            if (result) {
                var token = makeJWT(result.fb_uid);
                res.json({status:200, token:token,group:result.group,name:result.name,top_week:result.top_week});
            } else {
                res.json({status:400, msg:"Неверные данные"});
            }
        })
    }
});

module.exports = router;