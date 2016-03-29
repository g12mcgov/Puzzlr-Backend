var mongoose = require('mongoose');
var userSchema = new mongoose.Schema({
		name: String,
		_userId: Schema.Types.ObjectId
});
mongoose.model('User', userSchema);
