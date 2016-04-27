/*
* @Author: grantmcgovern
* @Date:   2016-03-31 20:53:36
* @Last Modified by:   Grant McGovern
* @Last Modified time: 2016-04-27 11:25:07
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
router.use(methodOverride(function (req, res){
      if (req.body && typeof req.body === 'object' && '_method' in req.body) {
        // look in urlencoded POST bodies and delete it
        var method = req.body._method
        delete req.body._method
        return method
      }
}))

/* Route middleware to validate :to_id */
router.param('to_id', function(req, res, next, to_id) {
    // Find the ID in the Database
    mongoose.model('Post').find({ to: req.to_id } , function(err, post) {
        //if it isn't found, we are going to repond with 404
        if(err) {
            console.log(to_id + ' was not found');
            res.status(404)
            var err = new Error('Not Found');
            err.status = 404;
            res.format({
                html: function() {
                    next(err);
                 },
                json: function() {
                       res.json({ message : err.status  + ' ' + err });
                 }
            });
        //if it is found we continue on
        } else {
            //uncomment this next line if you want to see every JSON document response for every GET/PUT/DELETE call
            console.log(post);
            // once validation is done save the new item in the req
            req.to_id = to_id;
            // go to the next thing
            next(); 
        } 
    });
  });


/* GET all posts */
router.route('/')
    .get(function(req, res, next) {
        // retrieve all posts from Mongo
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
      var question = req.body.question;
      var choices = req.body.choices;
      var answer = req.body.answer;

        // Create the post in the database
        mongoose.model('Post').create({
            from : from,
            to : to,
            picture : picture, 
            question : question,
            choices: choices,
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
                  console.log(post);
                  res.format({
                    //JSON response will show the newly created post
                    json: function(){
                        res.json(post);
                    }
                });
              }
        })
    })

// route middleware to validate :id
router.param('id', function(req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('Post').findById(id, function(err, post) {
        //if it isn't found, we are going to repond with 404
        if(err) {
            console.log(id + ' was not found');
            res.status(404)
            var err = new Error('Not Found');
            err.status = 404;
            res.format({
                html: function(){
                    next(err);
                 },
                json: function(){
                       res.json({message : err.status  + ' ' + err});
                 }
            });
        //if it is found we continue on
        } else {
            //uncomment this next line if you want to see every JSON document response for every GET/PUT/DELETE call
            console.log(post);
            // once validation is done save the new item in the req
            req.id = id;
            // go to the next thing
            next(); 
        } 
    });
});


/* GET post by ID */
router.route('/:id')
  .get(function(req, res) {
    mongoose.model('Post').findById(req.id, function(err, post) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err);
      } else {
        res.format({
          json: function(){
              res.json(post);
          }
        });
      }
    });
  });

/* DELETE post by ID */
router.route('/delete/:id')
  .get(function(req, res) {
    mongoose.model('Post').findById(req.id, function(err, post) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err);
      } else {
        //remove it from Mongo
          post.remove(function(err, post) {
              if(err) {
                  return console.error(err);
              } else {
                  //Returning success messages saying it was deleted
                  console.log('DELETE removing ID: ' + post._id);
                  res.format({
                      json: function(){
                             res.json({message : 'deleted',
                                 item : post
                             });
                       }
                    });
              }
          });
        }
    });
  });

module.exports = router;
