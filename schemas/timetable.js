var mongoose = require("mongoose");

var timetableSchema = new mongoose.Schema({
    group:String,
    top: [[{
        les_number:Number,
        les_type:String,
        les_aud:String,
        les_name:String   
    }]],
    bot: [[{
        les_number:Number,
        les_type:String,
        les_aud:String,
        les_name:String   
    }]]
});

module.exports = mongoose.model("timetableModel",timetableSchema);