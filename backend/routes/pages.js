var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send([{"id": 1, "name": "page1"}, {"id": 2, "name": "page2"}]);  // call get pages fxn
});

module.exports = router;