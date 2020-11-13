const express = require('express');
const app = express();
const bodyparser = require('body-parser');
const path = require('path');
const mongoose = require('mongoose');
const port = 5000;
const cors = require('cors');

app.use(bodyparser.json());
app.use(bodyparser.urlencoded({ extended: false }));
app.use(cors());

const mongodburl = 'mongodb+srv://sreedev:sreedev@cluster0.5lrqu.mongodb.net/node-socialmedia?retryWrites=true&w=majority';
mongoose.connect(mongodburl,{ useUnifiedTopology: true },{useNewUrlParser:true},(err,data)=>{
	if(data) {
		console.log('mongodb_connected_successfully')
	} else {
		console.log(err)
	}
})

app.use('/public', express.static(__dirname + '/public'));



app.all('/createuser',require('./controller/User.js'));
app.all('/signin',require('./controller/User.js'));
app.all('/addpost',require('./controller/File.js'));
app.all('/getpost',require('./controller/File.js'));
app.all('/deletepost',require('./controller/File.js'));
app.all('/addcomment',require('./controller/Comment.js'));
app.all('/getcomment',require('./controller/Comment.js'))
app.all('/delete',require('./controller/Comment.js'));
app.all('/updatecomment',require('./controller/Comment.js'));
app.all('/delete/:commentid',require('./controller/Comment.js'));


app.listen(port,()=>{
	console.log(`server is running on port ${port}`)
})