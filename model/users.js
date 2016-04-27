/*
* @Author: Grant McGovern
* @Date:   2016-03-31 23:25:38
* @Last Modified by:   Grant McGovern
* @Last Modified time: 2016-04-27 10:37:06
*/
var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
		firstName: String,
		lastName: String,
		email: String,
		picture: String,
		facebook_id: String,
		posts_recieved: [],
		posts_sent: []
}, { collection: 'users', strict: false } );
mongoose.model('User', userSchema);

