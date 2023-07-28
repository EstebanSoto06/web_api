const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const promptRequest = new Schema({
  tag: { type: String},
  type: { type: String, required: true }, // Pueden ser "edit", "images" o "completions"
  userID: { type: String, required: true },
  // Otros atributos específicos de cada tipo de request
  data: { type: Object }
});

module.exports = mongoose.model('promptRequest', promptRequest);