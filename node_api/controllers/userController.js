var helpers = require('../config/helperFunctions.js');
var UserModel = require('../models/UserModel.js');

module.exports = function(server){

	server.get("/",function(req,res,next){
		UserModel.find({}, function (err, users) {
			// here the formal parameter users is basically a variable in which the data gets stored 
			helpers.success(res,next,users); 
		});
		
	});

	server.get("/user/:id",function(req,res,next){
		req.assert('id','Id is required and must be numeric').notEmpty();
		var errors = req.validationErrors();
		if (errors) {
			helpers.failure(res,next,errors[0],400);
		}
		UserModel.findOne({ _id: req.params.id }, function (err, user) {
			if(err) {
				helpers.failure(res,next,'Something went wrong while fetching from the database',500);		
			}
			if(user === null){
				helpers.failure(res,next,'The specified user cannot be found in the database',404);
			} 
			helpers.success(res,next,user); 
		});	
	});

	server.post("/user",function(req,res,next){
		req.assert('first_name','First name is required').notEmpty();
		req.assert('last_name','Last name is required').notEmpty();
		req.assert('email_address','Email address is required and must be a valid email ').notEmpty().isEmail();
		req.assert('career','Career is required').isIn(['student','teacher','professor']);

		var errors = req.validationErrors();
		if (errors) {
			helpers.failure(res,next,errors,404);
		}
		var user = new UserModel();
		user.first_name=req.params.first_name;
		user.last_name=req.params.last_name;
		user.email_address=req.params.email_address;
		user.career=req.params.career;
		user.save(function(err) {
			helpers.failure(res,next,'The user cannot be added into the database',500);
		});
		helpers.success(res,next,user);
	});

	server.put("/user/:id",function(req,res,next){
		req.assert('id','Id is required and must be numeric').notEmpty();
		var errors = req.validationErrors();
		if (errors) {
			helpers.failure(res,next,errors[0],404);
		}
		UserModel.findOne({ _id: req.params.id }, function (err, user) {
			if(err) {
				helpers.failure(res,next,'Something went wrong while fetching from the database',500);		
			}
			if(user === null){
				helpers.failure(res,next,'The specified user cannot be found in the database',404);
			}
			var updates=req.params;
			delete updates.id;
			for(var field in updates){
				user[field]=updates[field];
			}
			user.save(function(err) {
				if (err) {
					helpers.failure(res,next,'The user cannot be added into the database',500);	
				}
				else {
					helpers.success(res,next,user);
				}
			}); 
			//helpers.success(res,next,user); 
		});
	});

	server.del("/user/:id",function(req,res,next){
		req.assert('id','Id is required and must be numeric').notEmpty();
		var errors = req.validationErrors();
		if (errors) {
			helpers.failure(res,next,errors[0],404);
		}
		UserModel.findOne({_id: req.params.id}, function (err, user) {
			if(err) {
				helpers.failure(res,next,'Something went wrong while fetching from the database',500);		
			}
			if(user === null){
				helpers.failure(res,next,'The specified user cannot be found in the database',404);
			}
			user.remove(function(err) {
				if (err) {
					helpers.failure(res,next,'The user cannot be removed from the database',500);
				}
				else {
					helpers.success(res,next,user);		
				}
			}); 
		//	helpers.success(res,next,user); 
		});
	});
}