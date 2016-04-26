var mongoose = require('mongoose');
// Connect to Digital Ocean MongoDB instance
// TODO: Should probably change this to pass in option args from a config file
mongoose.connect('mongodb://root:root@159.203.146.89:27017/puzzlr');