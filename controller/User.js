const express = require('express');
const router = express.Router();
const User = require('../models/user');
const { v4: uuidv4 } = require('uuid');
const _ = require('lodash');
const jwt = require('jsonwebtoken');
const secret_key = 'xxxxxxxxx'

router.post('/createuser',async(req,res)=>{
	const username = req.body.username;
	const password = req.body.password;
	const email = req.body.email;
	const age = req.body.age;
	if(_.isEmpty(username)) {
		res.json({
			status : 'error',
			message : 'username_cannot_empty'
		})
	} if(_.isEmpty(password)) {
		res.json({
			status : 'error',
			message : 'password_cannot_empty'
		})
	} if(_.isEmpty(email)) {
		res.json({
			status : 'error',
			message : 'email_cannot_empty'
		})
	} if(_.isEmpty(age)) {
		res.json({
			status : 'error',
			message : 'age_cannot_empty'
		})
	} else {
		const find =  await User.findOne({username:username});
		if(find === null) {
			const newuser = new User({
				username : username,
				password : password,
				email : email,
				age : parseInt(age),
				uuid : uuidv4()
			});
			const datasave = await newuser.save();
			if(datasave) {
				res.json({
					status : 'success',
					message : 'user_created_successfully',
					userdata : datasave
				})
			} else {
				res.json({
					status : 'error',
					message : 'cant_create_user'
				})
			}
		} else {
			res.json({
				status : 'error',
				message : 'user_already_prsesent'
			})
		}
	}
})


router.post('/signin',async(req,res)=>{
	const username = req.body.username;
	const email = req.body.email;
	const password = req.body.password;
	const validate = username ? username : email;
	if(_.isEmpty(validate)) {
		res.json({
			status : 'error',
			message : 'email or username should provide'
		})
	} if(_.isEmpty(password)) {
		res.json({
			status : 'error',
			message : 'password_should_not_empty'
		})
	} else {
		const find = await User.findOne({
     		$or: [
            	{ username:username },
            	{ email : email}
          	]
   		})
   		if(find!==null) {
   			if(password === find.password) {
   				const token = jwt.sign({ uuid : find.uuid }, secret_key);
   				if(token) {
   					const update = await User.update({uuid : find.uuid},{authtoken:token});
   					if(update) {
   						res.json({
   							status : 'success',
   							message : 'user_authenticated_successfully',
   							authtoken : token,
   							username : find.username
   						})
   					} else {
   						res.json({
   							status : 'error',
   							message : 'cant_update'
   						})
   					}
   				} else {
   					res.json({
   						status : 'error',
   						message : 'token_cant_generate'
   					})
   				}
   			} else {
   				res.json({
   					status : 'error',
   					message : 'password_is_invalid'
   				})
   			}
   		} else {
   			res.json({
   				status : 'error',
   				message : 'user_cant_find'
   			})
   		}
	}
})

module.exports = router;