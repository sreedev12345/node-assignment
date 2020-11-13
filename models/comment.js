const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const commentSchema = new Schema({
	useruuid : {
		type : String
	},fileuuid : {
		type : String
	},uuid : {
		type : String
	},comment : {
		type :Array
	}
})

let comment = mongoose.model('comment',commentSchema);
module.exports = comment;