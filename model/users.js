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

