var mongoose = require('mongoose');

var Schema = mongoose.Schema,
    ObjectId = Schema.ObjectId;
 
var UserSchema = new Schema({
    id    : ObjectId,
    first_name     : String,
    last_name     : String,
    email_address     : String,
    career     : String
});

// users here is the collection(table) name that we are
// going to create in mlab database
var UserModel = mongoose.model('users', UserSchema);

module.exports = UserModel;