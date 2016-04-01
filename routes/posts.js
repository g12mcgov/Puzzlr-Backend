/*
* @Author: grantmcgovern
* @Date:   2016-03-31 20:53:36
* @Last Modified by:   Grant McGovern
* @Last Modified time: 2016-03-31 22:26:48
*/


/**
 * POSTS
 */

var express = require('express'),
	router = express.Router(),
	mongoose = require('mongoose'), //mongo connection
	bodyParser = require('body-parser'), //parses information from POST
	methodOverride = require('method-override'); //used to manipulate POST


/* From method override */
router.use(bodyParser.urlencoded({ extended: true }))
router.use(methodOverride(function(req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
      }
}))


/* GET all posts */
router.route('/')
    .get(function(req, res, next) {
        // retrieve all posts from Monogo
        mongoose.model('Post').find({}, function(err, posts) {
              if (err) {
                  return console.error(err);
              } else {
                  //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                  res.format({
                    // JSON response will show all blobs in JSON format
                    json: function(){
                        res.json(posts);
                    }
                });
              }     
        });
    })
    // [ POST ] a new post
    .post(function(req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
      var from = req.body.from;
      var to = req.body.to;
      var picture = req.body.picture;
      var question = req.body.questions;
      var answer = req.body.answer;

        // Create the post in the database
        mongoose.model('Post').create({
            from : from,
            to : to,
            picture : picture, 
            question : question, 
            answer : answer
        }, function (err, post) {
              if (err) {
                  res.send("There was a problem adding the information to the database.");
              } else {
                  // post has been created
                  console.log('POST creating new post: ' + post);
                  /*
                   * After the post has been created in MongoDB, 
                   * attach it to the user who sent it AND the user
                   * who is supposed to recieve it.
                   */
                  /* TO */
                  mongoose.model('User').findOneAndUpdate(
                  		{_id: to},
						{$push: {"posts_from": {question: question, answer: answer}}},
						{safe: true, upsert: true},
						function(err, model) {
							console.log(err);
						}
					);
                  res.format({
                    //JSON response will show the newly created post
                    json: function(){
                        res.json(post);
                    }
                });
              }
        })
    });

module.exports = router;