const userModel = require("../schemas/user");
module.exports.login = function(req, res) {
    console.log(req.headers);
    userModel.findOne({mail:req.query.mail, pass:req.query.pass}, (err, doc) => {
        if (err) throw err;
        if (!doc) res.send("Wrong credentials"); 
        else {
            console.log(doc);
            res.send("Login successful!");
        };
    })
}