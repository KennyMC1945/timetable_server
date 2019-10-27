var mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
    name: String,
    mail: String,
    pass: String,
    group: String,
    notes: [String]
})

module.exports = mongoose.model('localUsers',userSchema);