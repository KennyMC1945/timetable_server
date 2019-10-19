const userModel = require("../schemas/user");
const jwt = require("jsonwebtoken");


module.exports.login = function(req, res) {
    console.log(req.headers);
    userModel.findOne({mail:req.query.mail, pass:req.query.pass}, (err, doc) => {
        if (err) throw err;
        if (!doc) res.json({status:400,msg:"Wrong credentials"}); 
        else {
            console.log(doc);
            var payload = {type:"local",id:doc._id};
            var token = jwt.sign(payload,process.env.SECRET_KEY);
            res.json({status:200,token:token});
        };
    })
}