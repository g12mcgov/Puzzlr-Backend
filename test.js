var mongoose = require('mongoose');
var db = mongoose.createConnection('mongodb://root:root@159.203.146.89:27017/puzzlr', 'test');

var schema = mongoose.Schema({ name: 'string' });
var Cat = db.model('Cat', schema);

var kitty = new Cat({ name: 'Zildjian' });
kitty.save(function (err) {
		  if (err) // ...
				    console.log('meow');
});
