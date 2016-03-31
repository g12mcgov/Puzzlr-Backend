var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
		firstName: String,
		lastName: String,
		email: String,
		picture: String,
		questions: []
});
mongoose.model('User', userSchema);
