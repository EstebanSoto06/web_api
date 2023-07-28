const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const user = new Schema({
  username: { type: String },
  email: { type: String },
  password: { type: String },
  verified: { type: Boolean, default: false},
  admin: { type: Boolean, default: false}
});

module.exports = mongoose.model('User', user);