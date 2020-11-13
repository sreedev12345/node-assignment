const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const fileSchema = new Schema({
	useruuid : {
		type : String
	},filename : {
		type : String
	},path : {
		type : String
	},uuid : {
		type : String
	}
})

let file = mongoose.model('file',fileSchema);
module.exports = file;