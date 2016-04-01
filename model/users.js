var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
		firstName: String,
		lastName: String,
		email: String,
		picture: String,
		posts_from: [],
		posts_to: []
});
mongoose.model('User', userSchema);

