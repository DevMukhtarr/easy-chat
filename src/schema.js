const mongoose = require('mongoose');
const Schema = mongoose.Schema;
require('dotenv').config()

// schema
const usersSchema = new Schema({
    username: String,
    email: String,
    password: String
})
 
module.exports = mongoose.model('User', usersSchema);