const mongoose = require('mongoose');
const Schema = mongoose.Schema;

const userSchema = new Schema({
	username : {
		type:String
	},
	password : {
		type : String
	},email : {
		type : String
	},age : {
		type : Number
	},
	uuid : {
		type : String
	},
	authtoken : {
		type:String
	}
})

let user = mongoose.model('user',userSchema);
module.exports = user;