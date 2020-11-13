const express = require('express');
const router = express.Router();
const _ = require('lodash');
const multer = require('multer');
const { v4: uuidv4 } = require('uuid');
const User = require('../models/user');
const File = require('../models/file');
const jwt = require('jsonwebtoken');
const secret_key = 'xxxxxxxxx'



const storage = multer.diskStorage({
	destination : function(req,file,cb) {
		cb(null,'./public/images')
	},
	filename:function(req,file,cb) {
		let image = file.originalname.split('.').pop();
		cb(null,Date.now() +'.' + image)
	}
})

const upload = multer({
	storage : storage
}).single('file')

router.post('/addpost',(req,res,err)=>{
console.log(req.headers)
const authtoken = req.headers['authtoken'];
        if(_.isEmpty(authtoken)) {
	    	res.json({
	    		status : 'error',
		    message : 'authtoken is invalid'
	    	})
    	} else {
		  upload(req,res,function(err){
	if(_.isEmpty(req.file)) {
    	res.json({
    		status : 'error',
    		message:'file is not valid'
    	})
    } else {
	 jwt.verify(authtoken,secret_key,(err,data)=>{
	     const fileadd = new File({
		useruuid : data.uuid,
		filename : req.file.filename,
		path : req.file.path,
		uuid : uuidv4()
	      })
              fileadd.save((err,data)=>{
                res.json({data:data})
            })
         });
    }
  })
         
      }
})

router.get('/getpost',async(req,res)=>{
	const authtoken = req.headers['authtoken'];
	if(_.isEmpty(authtoken)) {
		res.json({
			status : 'error',
			message : 'authtoken is invalid'
		})
	} else {
		const verifytoken = await jwt.verify(authtoken,secret_key);
		if(verifytoken) {
			const usercheck = await User.findOne({uuid:verifytoken.uuid});
			if(usercheck) {
				const file = await File.find({});
				if(file.length>0) {
					res.json({
						data : file
					})
				} else {
					res.json({
						status : 'error',
						message : 'cant find post'
					})
				}
			}
		} else {
			res.json({
				status : 'error',
				message : 'token is invalid'
			})
		}
	}
})


router.get('/deletepost',async(req,res)=>{
	const authtoken = req.headers['authtoken'];
	if(_.isEmpty(authtoken)) {
		res.json({
			status : 'error',
			message : 'token cant find'
		})
	} else {
		const verifytoken = await jwt.verify(authtoken,secret_key);
		if(verifytoken) {
			const usercheck = await User.findOne({uuid : verifytoken.uuid});
			if(usercheck) {
				const filefind = await File.findOne({useruuid:usercheck.uuid});
				if(filefind) {
					const deletepost = await File.remove({uuid:filefind.uuid});
					if(deletepost) {
						res.json({
							status : 'success',
							message : 'post removed sucessfully',
							data : deletepost
						})
					} else {
						res.json({
							status : 'error',
							message : 'file cant remove'
						})
					}
				} else {
					res.json({
						status : 'error',
					    message : 'cannot find post'
					})
				}
			} else {
				res.json({
					status : 'error',
					message : 'user is not valid'
				})
			}
		} else {
			res.json({
				status : 'error',
				message : 'token is not valid'
			})
		}
	}
})

module.exports = router;
