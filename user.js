var mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    login: String,
    pass: String,
    mail: String,
    group: String,
})

module.exports = mongoose.model('Users',userSchema);