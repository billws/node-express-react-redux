var express = require('express');
var topicServices = require('../services/topicServices');
var tools = require('../tools/tools');
var router = express.Router();

/* Topic actions. */

/**
 * Get all topics.
 */
router.get('/', function(req, res) {
    res.json(topicServices.getAll());
});

/**
 * Get topics sorted by upvote number descending.
 */
router.get('/sorted/:count', function(req, res) {
    let count = 20;

    if(parseInt(req.params.count, 10) > 0 && parseInt(req.params.count, 10) < 50){
        count = parseInt(req.params.count, 10);
    }
    res.json(topicServices.getTopicsSortedUpvote(count));
});

/**
 * Get topic by topic id.
 */
router.get('/:topicId', function(req, res){
    if(!tools.checkIsNumber(req.params.topicId) || 
        parseInt(req.params.topicId, 10) < 0 || 
        parseInt(req.params.topicId, 10) > Number.MAX_SAFE_INTEGER){
        res.json({message:"Topic ID is not correct."});    
    }else{
        res.json(topicServices.get(req.params.topicId));
    }
});

/**
 * Create topic.
 */
router.post('/', function(req, res){
    if(typeof req.body.topicText === "undefined" || req.body.topicText === ""){
        res.json({message:"No Data."});    
    }else{
        if(req.body.topicText.length < 256){
            res.json(topicServices.create(req.body.topicText));
        }else{
            res.json({message: "text too long."});
        }
    }
});

/**
 * Modify topic by topic id.
 */
router.put('/:topicId', function(req, res){
    if(!tools.checkIsNumber(req.params.topicId) ||
        parseInt(req.params.topicId) < 0 || 
        parseInt(req.params.topicId) > Number.MAX_SAFE_INTEGER ||
        typeof req.body.topicText === "undefined" || 
        req.body.topicText === ""){
        res.json({message: "Require topic text or topic id not correct."});
    }else{
        res.json(topicServices.set(req.params.topicId, req.body.topicText));
    }
});

/**
 * Delete topic by topic id.
 */
router.delete('/:topicId', function(req, res){
    if(!tools.checkIsNumber(req.params.topicId) || 
        parseInt(req.params.topicId, 10) < 0 || 
        parseInt(req.params.topicId, 10) > Number.MAX_SAFE_INTEGER){
        res.json({message:"Topic ID is not correct."});    
    }else{
        res.json(topicServices.remove(req.params.topicId));
    }
    
});

module.exports = router;
