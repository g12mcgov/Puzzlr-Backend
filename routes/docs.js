/*
* @Author: grantmcgovern
* @Date:   2016-03-31 13:31:16
* @Last Modified by:   Grant McGovern
* @Last Modified time: 2016-03-31 13:34:40
*/

/*
* @Author: grantmcgovern
* @Date:   2016-03-31 13:31:16
* @Last Modified by:   grantmcgovern
* @Last Modified time: 2016-03-31 13:31:16
*/

var express = require('express');
var router = express.Router();
var md = require('marked');

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('docs', { title: 'Puzzlr-Backend Docs', md: md });
});

module.exports = router;