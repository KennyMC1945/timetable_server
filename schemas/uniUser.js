var mongoose = require("mongoose");

const firebaseUserSchema = new mongoose.Schema({
    name: String,
    fb_uid: String,
    group: String,
    top_week: Number,
    notes: [String]
});

module.exports= mongoose.model("users",firebaseUserSchema);