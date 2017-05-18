var cacheServices = require('./cacheServices');
var voteServices = require('./voteServices');

const topicKey = "topicCache";
/*
Topic format in cache.
{
    topicId: topicText
}

Output format.
{
    topicId: 
        {
            topic: topicText,
            vote: [upVoteNumber, downVoteNumber]
        }
}
*/

var topicServices = {
/**
 * Get topic by topic id.
 */
    get: function(topicId){
        let results = {};
        let content = cacheServices.read(topicKey, topicId);
        if(typeof content === 'string'){
            results[topicId] = {
                'topic': content, 
                'vote': voteServices.get(topicId)
            };
        }
        return results;
    },

/**
 * Get all topics.
 */
    getAll: function(){
        let results = {};
        let totalTopics = cacheServices.readAll(topicKey);
        if(typeof totalTopics !== 'undefined'){
            Object.keys(totalTopics).map(key => 
                results[key] = {
                    'topic': totalTopics[key],
                    'vote': voteServices.get(key)
                }
            );
        }
        return results;
    },

/**
 * Get topics sorted by upvote number descending.
 */
    getTopicsSortedUpvote: function(count){
        let results = [];
        let sortedTopicsId = voteServices.getTopTopics();
        if(typeof count === "undefined" || typeof count !== "number"){
            count = 20;
        }
        for(let index = 0, max = sortedTopicsId.length; index < max && index < count; index++){
            let sortedItem = {};
            sortedItem[sortedTopicsId[index]] = {
                "topic": cacheServices.read(topicKey, sortedTopicsId[index]),
                "vote": voteServices.get(sortedTopicsId[index])
            };
            results.push(sortedItem);
        }
        return results;
    },

/**
 * Create topic.
 */
    create: function(topicText){
        cacheServices.update(topicKey, cacheServices.getTopicIndex(), topicText);
        voteServices.set(cacheServices.getTopicIndex(), 0, 0);
        cacheServices.addTopicIndex();
        return 0;
    },

/**
 * Modify topic by topic.
 */
    set: function(topicId, topicText){
        let content = cacheServices.read(topicKey, topicId);
        if(typeof content !== 'undefined'){
            content = topicText;
            cacheServices.update(topicKey, topicId, content);
        }
        return 0;
    },

/**
 * Remove topic by topic id.
 */
    remove: function(topicId){
        cacheServices.delete(topicKey, topicId);
        voteServices.remove(topicId);
        return 0;
    }

};


module.exports = topicServices;