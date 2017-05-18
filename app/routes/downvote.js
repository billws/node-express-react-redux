var express = require('express');
var voteServices = require('../services/voteServices');
var tools = require('../tools/tools');
var router = express.Router();

/* Downvote actions. */

/**
 * Get downvote by topic id.
 */
router.get('/topicId/:topicId', function(req, res) {
    if(typeof req.params.topicId === "undefined" || 
        !tools.checkIsNumber(req.params.topicId) ||
        parseInt(req.params.topicId, 10) < 0 ||
        parseInt(req.params.topicId, 10) > Number.MAX_SAFE_INTEGER){
        res.json({message: "Topic id is not correct."});
    }else{
        res.json(voteServices.get(req.params.topicId));
    }
});

/**
 * Modify downvote number by topic id.
 */
router.post('/', function(req, res){
    if(typeof req.body.topicId === "undefined" || 
        !tools.checkIsNumber(req.body.topicId) ||
        parseInt(req.body.topicId, 10) < 0 || 
        parseInt(req.body.topicId, 10) > Number.MAX_SAFE_INTEGER ||
        typeof req.body.voteNumber === "undefined" || 
        !tools.checkIsNumber(req.body.voteNumber) ||
        parseInt(req.body.voteNumber, 10) < 0 ||
        parseInt(req.body.voteNumber, 10) > Number.MAX_SAFE_INTEGER) {
        res.json({message:"Input data is not correct."});
    }else{
        res.json(voteServices.setDownVoteNumber(parseInt(req.body.topicId, 10), parseInt(req.body.voteNumber,10)));
    }
});

/**
 * Add 1 to downvote number by topic id.
 */
router.put('/topicId/:topicId', function(req, res){
    if(typeof req.params.topicId === "undefined" ||
        !tools.checkIsNumber(req.params.topicId) ||
        parseInt(req.params.topicId, 10) < 0 ||
        parseInt(req.params.topicId, 10) > Number.MAX_SAFE_INTEGER) {
        res.json({message:"Topic id is not correct."});
    }else{
        res.json(voteServices.downVote(req.params.topicId));
    }
});

module.exports = router;
