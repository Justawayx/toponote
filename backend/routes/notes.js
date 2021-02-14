var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
    console.log("get notes req: " + req);
    res.send([{"title": "my title", "body": "parag<b>rap</b>h", "tags": ["a", "b"], "prereqs": ["c","d"]}]);
});

module.exports = router;