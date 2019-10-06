const userModel = require('../schemas/user');
const joi = require("@hapi/joi");

const regScheme = joi.object().keys({
    pass:joi.string().required(),
    name:joi.string().required(),
    mail:joi.string().required(),
    group:joi.string().required()
})

async function isUserExists(usermail){
    var doc = await userModel.findOne({mail:usermail}).exec();
    console.log(doc);
    return doc
}

function registerNewUser(query) {
    var newUser = new userModel({
        pass: query.pass,
        name: query.name,
        mail: query.mail,
        group: query.group
    })
    var savedUser = newUser.save();
    return savedUser;
}

module.exports.register = function(req,res) {
    console.log("POST Request!");
    var validation = regScheme.validate(req.query);
    if (validation.error){
        console.log("Wrong credentials");
        res.send("Wrong credentials");
        return;
    }
    isUserExists(req.query.mail).then((result)=>{
        if (result) {
            res.send("User exists!");
            console.log("User exists!");
            return;
        }
        else {    
            registerNewUser(req.query);
            console.log("Ok!");
            res.send("Fine");
        }
    })
}
