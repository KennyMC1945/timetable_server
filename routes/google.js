const router = require("express").Router();
const bodyParser = require("body-parser");
const {OAuth2Client} = require("google-auth-library");
const googleUserModel = require("../schemas/googleUser");
const client = new OAuth2Client(process.env.CLIENT_ID);
const joi = require("@hapi/joi");

const regScheme = joi.object().keys({
    id:joi.string().required(),
    name:joi.string().required(),
    group:joi.string().required()
})

async function isUserExist(userId){
    var user = await googleUserModel.findOne({id:userId}).exec();
    return user;
}

function makeGoogleJWT(id){
    var payload = {type:"google",id:id};
    var token = jwt.sign(payload,process.env.SECRET_KEY);
    return token;
}

async function verify(token) {
    const ticket = await client.verifyIdToken({
        idToken: token,
        audience: process.env.CLIENT_ID
    });
    const payload = ticket.getPayload();
    console.log("PAYLOAD:\n"+payload.name);
    const userid = payload['sub'];
    console.log("USERID:\n"+userid);
    return payload.name, userid;
}


router.post("/verify", function (req,res) {
    console.log("Verify Connection!")
    if (req.body && req.body.token){
        console.log("req.body.token: "+req.body.token)
        verify(req.body.token).then((name, id)=>{
            isUserExist(id).then((result) => {
                if (result) {
                    var token = makeGoogleJWT(result._id); // создаем токен
                    res.json({ status: 200, token: token });
                    } 
                else { res.json({ status:300, username:name,  googleId:id }); }   
            }).catch(console.error); 
        });
    } else {
        res.json({status:400,msg:"No token"});
    }
});  

router.post("/registerUser", function (req,res) {
    var verification = regScheme.validate(req.body);
    if (verification.error){
        res.json({status:400,msg:"Неверные данные"});
    } else {
        var newGoogleUser = new googleUserModel({
            google_id:req.body.id,
            name:req.body.name,
            group:req.body.group
        });
        var newUser = newGoogleUser.save();
        var token = makeGoogleJWT(newUser._id);
        res.json({ status: 200, token: token });
    }
    
})

module.exports = router;