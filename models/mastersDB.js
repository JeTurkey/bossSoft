var mongoose = require("mongoose");


var MastersSchema = new mongoose.Schema({
    phonenumber: String
});



module.exports = mongoose.model("master", MastersSchema)