var mongoose = require("mongoose");

const googleUserSchema = new mongoose.Schema({
    name: String,
    google_id: String,
    group: String,
    notes: [String]
});

module.exports= mongoose.model("googleUsers",googleUserSchema);