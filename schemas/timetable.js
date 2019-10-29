var mongoose = require("mongoose");

var timetableSchema = new mongoose.Schema({
    group:String,
    mon: String,
    tue: String,
    wed: String,
    thu: String,
    fri: String
});

module.exports = mongoose.model("timetables",timetableSchema);