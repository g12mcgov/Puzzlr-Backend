var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
		name: String,
		_userId: mongoose.Schema.Types.ObjectId
});
mongoose.model('User', userSchema);
