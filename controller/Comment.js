const express = require('express');
const router = express.Router();
const User = require('../models/user');
const File = require('../models/file');
const Comment = require('../models/comment.js');
const { v4: uuidv4 } = require('uuid');
const jwt = require('jsonwebtoken');
const secret_key = 'xxxxxxxxx';
const _ = require('lodash');

router.post('/addcomment',async(req,res)=>{
	const authtoken = req.headers['authtoken'];
	const commentdata = req.body.commentdata;
	const postid = req.body.postid;
        console.log(postid);
	if(_.isEmpty(authtoken)) {
		res.json({
			status : 'error',
			message : 'you dont have permission'
		})
	} else {
		const verifytoken = await jwt.verify(authtoken,secret_key);
		if(verifytoken) {
			const usercheck = await User.findOne({uuid : verifytoken.uuid});
			if(usercheck) {
				const post = await File.findOne({uuid : postid});
				if(post) {
					const createcomment = new Comment({
						fileuuid : post.uuid,
						useruuid : usercheck.uuid,
						comment : {
							username : usercheck.username,
							useruuid : usercheck.uuid,
							commentdata : commentdata
						},
						uuid : uuidv4()
					})
					const commentsave = await createcomment.save();
					if(commentsave) {
						res.json({
							status : 'success',
							message : 'comment_added_successfully',
							data : commentsave
						})
					} else {
						res.json({
							status : 'error',
							message : 'comment_cant_add'
						})
					}
				} else {
					res.json({
						status : 'error',
						message : 'cant_find_post'
					})
				}
			}
		} else {
			res.json({
				status : 'error',
				message : 'authtoken is not valid'
			})
		}
	}
})


router.get('/getcomment',async(req,res)=>{
	const authtoken = req.headers.authtoken;;
	if(_.isEmpty(authtoken)) {
		res.json({
			status : 'error',
			message : 'you are restricted to inaccess'
		})
	} else{
		const verifytoken = await jwt.verify(authtoken,secret_key);
		if(verifytoken) {
			const usercheck = await User.findOne({uuid : verifytoken.uuid});
			if(usercheck) {
                             const value = [];
				const getcomment = await Comment.find({});
                                 const commentid = [];
                               getcomment.map((val,i)=>{
                                val.comment.map((data,j)=>{
                                	
                                         const ele = data;
                                         console.log(val.uuid);
                                         value.push(ele);
                                   })
                                })
				if(getcomment.length>0) {
                                       
					res.json({status : 'success',comment : value,data:getcomment})
				} else if(getcomment.length<=0){
					res.json({
						message : 'No_comments_found'
					})
				}else {
					res.json({
						status : 'error',
						message : 'comment_cant_find'
					})
				}
			} else {
				res.json({
					status : 'error',
					message : 'user_is_invalid'
				})
			}
		} else {
			res.json({
				status : 'error',
				message : 'authtoken_is_invalid'
			})
		}
	}
})

router.get('/delete/:commentid',async(req,res)=>{
	const authtoken = req.headers['authtoken'];
	const commentid = req.params.commentid;
	if(_.isEmpty(authtoken)) {
		res.json({
			status : 'error',
			message : 'you are restricted to access'
		})
	} else {
		const verifytoken = await jwt.verify(authtoken,secret_key);
		if(verifytoken) {
			const usercheck = await User.findOne({uuid:verifytoken.uuid});
			if(usercheck) {
				const commentfind = await Comment.findOne({uuid:commentid});
				if(commentfind) {
					const remove = await Comment.update({'_id':commentfind._id},{
						'$pull' : {
							'comment' : {
								'useruuid' : usercheck.uuid
							}
						}
					})
					res.json({
						status : 'success',
						message : 'comment_delte_successfully'
					})
				} else {
					res.json({
						status : 'error',
						message : 'cant_find_comment'
					})
				}
			} else {
				res.json({
					status : 'error',
					message : 'user_not_find'
				})
			}
		} else {
			res.json({
				status : 'error',
				message : 'token_is_not_valid'
			})
		}
	}
})

router.post('/updatecomment',async(req,res)=>{
	const authtoken = req.headers['authtoken'];
console.log(authtoken)
	const commentid = req.body.commentid;
	const postid = req.body.postid;
	const commentdata = req.body.commentdata;
	if(_.isEmpty(authtoken)) {
		res.json({
			status : 'error',
			message : 'you_are_restricted_to_access'
		})
	} if(_.isEmpty(commentid)) {
		res.json({
			status : 'error',
			message : 'commentid_not_found'
		})
	} else {
		const verifytoken = await jwt.verify(authtoken,secret_key);
		if(verifytoken) {
			const usercheck = await User.findOne({uuid:verifytoken.uuid});
			if(usercheck) {
				const post = await File.findOne({uuid : postid});
				if(post) {
					const commentupdate = await Comment.findOne({uuid : commentid});
					if(commentupdate.comment) {
						const updatecomment = await Comment.updateOne({uuid : commentid,'comment.useruuid' : usercheck.uuid},{$set:{
							'comment.$.commentdata' : commentdata
						}});
						if(updatecomment) {
							res.json({
								status : 'success',
								message : 'comment_updated_succesfully',
								data : updatecomment
							})
						} else {
							res.json({
								status : 'error',
								message :'cant_update'
							})
						}
					} else {
						res.json({
							status : 'error',
							message : 'cant_find_comment'
						})
					}
				}
			} else {
				res.json({
					status : 'error',
					message : 'user_is_invalid'
				})
			}
		} else {
			res.json({
				status : 'error',
				message : 'token_is_not_valid'
			})
		}
	}
})

module.exports = router;
