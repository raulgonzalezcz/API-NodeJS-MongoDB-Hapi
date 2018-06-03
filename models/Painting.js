const mongoose = require('mongoose');
const Schema = mongoose.Schema;

//ID assigned by MongoDB default
const PaintingSchema = new Schema({
	name: String,
	url: String,
	techniques: [String]
});

module.exports = mongoose.model('Painting', PaintingSchema);