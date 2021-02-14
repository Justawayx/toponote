var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.send(["page1", "page2"]);
});

router.get('/getnotes', function(req, res, next) {
  res.send([]);
});

module.exports = router;