/*
* @Author: grantmcgovern
* @Date:   2016-03-31 20:10:06
* @Last Modified by:   Grant McGovern
* @Last Modified time: 2016-03-31 21:57:40
*/

var mongoose = require('mongoose');
var postSchema = new mongoose.Schema({
		from: String,
		to: String,
		picture: String,
		question: String,
		answer: String
}, { collection: 'posts'} );
mongoose.model('Post', postSchema, 'posts');