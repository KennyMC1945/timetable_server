var mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    mail: String,
    pass: String,
    group: String,
})

module.exports = mongoose.model('Users',userSchema);