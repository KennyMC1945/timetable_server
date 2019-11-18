const router = require("express").Router();
const firebaseUserModel = require("../schemas/uniUser");
const jwt = require("jsonwebtoken");


router.use((req,res,next) => {
    if (req.headers.authorization){
        console.log("Auth!");
        var token = req.headers.authorization.split(' ')[1];
        console.log("token "+token );
        jwt.verify(token,process.env.SECRET_KEY,(err,payload) => {
            if (err) {console.log("err"); next(); }
            console.log(payload);
            if (payload.id) {
                firebaseUserModel.findOne({fb_uid:payload.id}, (err,user) =>{
                    if (user) {
                        console.log("User Found!\n" + user);
                        req.user = user;     
                        next();                   
                    }
                    else { res.json({status:400,msg:"Неверный токен"}); }
                });
            }
        });
    }
    else res.json({status:401,msg:"Неверный токен"});
})

router.post("/edit", function (req,res) {
    console.log("User to edit "+req.user);
    if (req.body.name) req.user.name = req.body.name;
    if (req.body.group) req.user.group = req.body.group;
    if (req.body.top_week) req.user.top_week = req.body.top_week;
    console.log("User after edit "+req.user);
    req.user.save().then((newUser)=>{
        res.json({status:200,name:newUser.name,group:newUser.group,top_week:newUser.top_week});
    });
});


module.exports = router;