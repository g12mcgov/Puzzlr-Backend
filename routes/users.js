/*
* @Author: Grant McGovern
* @Date:   2016-03-29 12:43:03
* @Last Modified by:   Grant McGovern
* @Last Modified time: 2016-04-26 23:47:49
*/

/**
 * USERS
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

/* 
 * ENDPOINTS 
 */

/* GET all users */
router.route('/')
    // GET all blobs
    .get(function(req, res, next) {
        //retrieve all blobs from Monogo
        mongoose.model('User').find({}, function(err, users) {
              if (err) {
                  return console.error(err);
              } else {
                  //respond to both HTML and JSON. JSON responses require 'Accept: application/json;' in the Request Header
                  res.format({
                      //HTML response will render the index.jade file in the views/blobs folder. We are also setting "blobs" to be an accessible variable in our jade view
                    html: function(){
                        console.log(users);
                        res.render('users/index', {
                              title: 'All Users',
                              "users" : users
                          });
                    },
                    // JSON response will show all blobs in JSON format
                    json: function(){
                        console.log(users);
                        res.json(users);
                    }
                });
              }     
        });
    })
    // [ POST ] a new user
    .post(function(req, res) {
        // Get values from POST request. These can be done through forms or REST calls. These rely on the "name" attributes for forms
      var firstName = req.body.firstName;
      var lastName = req.body.lastName;
      var email = req.body.email;
      var picture = req.body.picture;
      var facebook_id = req.body.facebook_id;
      var friends = req.body.friends;
      // Questions should be empty by default
      var questions = [];
      // Notifications should be empty by default
      var notifications = [];
        // call the create function for our database
        mongoose.model('User').create({
            firstName : firstName,
            lastName : lastName,
            email : email,
            picture : picture,
            facebook_id : facebook_id,
            questions: questions,
            friends : friends,
            notifications : notifications
        }, function (err, user) {
              if (err) {
                  res.send("There was a problem adding the information to the database.");
              } else {
                  // User has been created
                  console.log('POST creating new user: ' + user);
                  res.format({
                    //JSON response will show the newly created user
                    json: function(){
                        res.json(user);
                    }
                });
              }
        })
    });

/* GET New Blob page. */
router.get('/new', function(req, res) {
    res.render('users/new', { title: 'Add New User' });
});

// route middleware to validate :id
router.param('id', function(req, res, next, id) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('User').findById(id, function(err, user) {
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
            console.log(user);
            // once validation is done save the new item in the req
            req.id = id;
            // go to the next thing
            next(); 
        } 
    });
});


/* GET user by ID */
router.route('/:id')
  .get(function(req, res) {
    mongoose.model('User').findById(req.id, function (err, user) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err);
      } else {
        res.format({
          html: function(){
              res.render('users/show', {
                "user" : user
              });
          },
          json: function(){
              res.json(user);
          }
        });
      }
    });
  });


// route middleware to validate :address
router.param('address', function(req, res, next, address) {
    //console.log('validating ' + id + ' exists');
    //find the ID in the Database
    mongoose.model('User').find( { email: address }, function(err, user) {
        //if it isn't found, we are going to repond with 404
        if(err) {
            console.log(address + ' was not found');
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
            console.log(user);
            // once validation is done save the new item in the req
            req.address = address;
            // go to the next thing
            next(); 
        } 
    });
});

/* GET user by email */
router.route('/email/:address')
  .get(function(req, res) {
    mongoose.model('User').find( { email: req.address }, function (err, user) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err);
      } else {
        res.format({
          json: function(){
              res.json(user);
          }
        });
      }
    });
  });

/* VALIDATE Facebook ID */
// route middleware to validate :facebook_id
router.param('facebook_id', function(req, res, next, facebook_id) {
    // Find the facebook_id in the Database
    mongoose.model('User').find( { facebook_id: req.facebook_id }, function(err, user) {
        //if it isn't found, we are going to repond with 404
        if(err) {
            console.log(facebook_id + ' was not found');
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
            // once validation is done save the new item in the req
            req.facebook_id = facebook_id;
            // go to the next thing
            next(); 
        } 
    });
});

/* GET user by email */
router.route('/facebook/:facebook_id')
  .get(function(req, res) {
    mongoose.model('User').find( { facebook_id: req.facebook_id }, function (err, user) {
      if (err) {
        console.log('GET Error: There was a problem retrieving: ' + err);
      } else {
        res.format({
          json: function(){
              res.json(user);
          }
        });
      }
    });
  });

/* EDIT user by ID */
router.route('/:id/edit')
	// GET the individual user by Mongo ID
	.get(function(req, res) {
	    // search for the user within Mongo
	    mongoose.model('User').findById(req.id, function(err, user) {
	        if (err) {
	            console.log('GET Error: There was a problem retrieving: ' + err);
	        } else {
	            //Return the user
	            console.log('GET Retrieving ID: ' + user._id);
	            res.format({
	                //HTML response will render the 'edit.jade' template
	                html: function(){
	                       res.render('users/edit', {
	                          title: 'user' + user._id,
	                          "user" : user
	                      });
	                 },
	                 //JSON response will return the JSON output
	                json: function(){
	                       res.json(blob);
	                 }
	            });
	        }
	    });
	})
	// [ PUT ] to update a blob by ID
	.put(function(req, res) {
	    // Get our REST or form values. These rely on the "name" attributes
	    var firstName = req.body.firstName;
	    var lastName = req.body.lastName;
	    var email = req.body.email;
	    var picture = req.body.picture;
	    var questions = req.body.questions;

	    // Find the document by ID
	    mongoose.model('User').findById(req.id, function(err, user) {
	        // Update
	        user.update({
	            firstName : firstName,
	            lastName : lastName,
	            email : email,
	            picture : picture,
	            questions: questions
	        }, function (err, userID) {
	          if(err) {
	              res.send("There was a problem updating the information to the database: " + err);
	          } 
	          else {
	                  //HTML responds by going back to the page or you can be fancy and create a new view that shows a success page.
	                  res.format({
	                      html: function() {
	                           res.redirect("/users/" + user._id);
	                     },
	                     //JSON responds showing the updated values
	                    json: function() {
	                           res.json(user);
	                     }
	                  });
	           }
	        })
	    });
	})
	// [ DELETE ] a Blob by ID
	.delete(function (req, res){
	    //find blob by ID
	    mongoose.model('User').findById(req.id, function(err, user) {
	        if (err) {
	            return console.error(err);
	        } else {
	            //remove it from Mongo
	            user.remove(function(err, user) {
	                if(err) {
	                    return console.error(err);
	                } else {
	                    //Returning success messages saying it was deleted
	                    console.log('DELETE removing ID: ' + user._id);
	                    res.format({
	                        //HTML returns us back to the main page, or you can create a success page
	                          html: function(){
	                               res.redirect("/users");
	                         },
	                         //JSON returns the item with the message that is has been deleted
	                        json: function(){
	                               res.json({message : 'deleted',
	                                   item : user
	                               });
	                         }
	                      });
	                }
	            });
	        }
	    });
	});

module.exports = router;
