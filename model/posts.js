/*
* @Author: grantmcgovern
* @Date:   2016-03-31 20:10:06
* @Last Modified by:   Grant McGovern
* @Last Modified time: 2016-04-03 19:32:08
*/

var mongoose = require('mongoose');
var postSchema = new mongoose.Schema({
		from: String,
		to: String,
		picture: String,
		question: String,
		choices: [],
		answer: String
}, { collection: 'posts', strict: false } );
mongoose.model('Post', postSchema, 'posts');