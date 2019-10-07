var router = require("express").Router();

async function findUser(usermail){
    var user = await userModel.findOne({mail:usermail}).exec();
    console.log(user);
    return user
}

router.get("/getuser", function(req,res) {
    findUser(req.query.mail).then((doc) =>{
        if (doc) res.send("User found");
        else res.send("No such user!");
    });
});

router.get("/testtoken", function(req,res) {
    if (req.user){
        res.send(req.user);
    }
    else {
        res.send("Nope");
    }
});

module.exports = router;