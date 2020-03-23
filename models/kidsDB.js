var mongoose = require('mongoose');

var kidsSchema = new mongoose.Schema({
    belongto: String,
    phonenumber: String
})

var kids = mongoose.model('kid', kidsSchema)

module.exports = kids