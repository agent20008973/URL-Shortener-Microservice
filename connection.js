const mongoose = require('mongoose');
const Schema = mongoose.Schema;
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true });
const urlSchema = new Schema({
  original_url: String,
  short_url: String
});
var Url = mongoose.model("Url", urlSchema);
module.exports = Url