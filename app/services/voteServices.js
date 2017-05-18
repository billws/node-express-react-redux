var cacheServices = require('./cacheServices');

const voteKey = "voteCache", top20Topics = "topTopics";
/*
Vote number format in cache.
{
    topicId: [upVoteNumber, downVoteNumber]
}

*/

var voteServices = {
/**
 * Get vote by topic id.
 */
    get: function(topicId){
        let content = cacheServices.read(voteKey, topicId);
        if(Array.isArray(content)){
            return content;
        }else{
            if(topicId < cacheServices.getTopicIndex()){
                this.set(topicId, 0, 0);
            }
            return [0, 0];
        }
    },

/**
 * Get topics' id sorted by upvote descending.
 */
    getVotesByUpVoteDesc: function(){
        let allVote = cacheServices.readAll(voteKey);
        if(typeof allVote !== "object"){
            allVote = {};
        }
        return Object.keys(allVote)
            .sort((x,y) => allVote[y][0] - allVote[x][0]);
    },

/**
 * Get all from topTopic cache.
 */
    getTopTopics: function(){
        let topTopics = cacheServices.readAll(top20Topics);
        if(typeof topTopics !== "object"){
            topTopics = {};
        }

        return Object.keys(topTopics)
            .sort((x, y) => topTopics[y] - topTopics[x]);
    },

/**
 * When add or update a new key, add it into topTopic cache and get top 20 items after sort.
 */
    setTopTopics: function(topicId, upvoteNumber){
        let topTopics = cacheServices.readAll(top20Topics);
        if(typeof topTopics !== "object"){
            topTopics = {};
        }
        
        topTopics[topicId] = upvoteNumber;
        var updateOrder = {};

        Object.keys(topTopics)
            .sort((x, y) => topTopics[y] - topTopics[x]).slice(0, 20)
            .reduce(function(x, y){x = updateOrder; x[y] = topTopics[y];}, updateOrder);

        cacheServices.updateAll(top20Topics, updateOrder);
        return 0;
    },

/**
 * Modify upvote/downvote number by topic id.
 */
    set: function(topicId, upVoteNumber, downVoteNumber){
        cacheServices.update(voteKey, topicId, [upVoteNumber, downVoteNumber]);
        this.setTopTopics(topicId, upVoteNumber);
        return 0;
    },

/**
 * Modify upvote number by topic id.
 */
    setUpVoteNumer: function(topicId, upVoteNumber){
        let content = cacheServices.read(voteKey, topicId);
        if(Array.isArray(content)){
            this.set(topicId, upVoteNumber, content[1]);
        }
        return 0;
    },

/**
 * Modify downvote number by topic id.
 */
    setDownVoteNumber: function(topicId, downVoteNumber){
        let content = cacheServices.read(voteKey, topicId);
        if(Array.isArray(content)){
            this.set(topicId, content[0], downVoteNumber);
        }
        return 0;
    },

/**
 * Add 1 to upvote number by topic id.
 */
    upVote: function(topicId){
        let content = cacheServices.read(voteKey, topicId);
        if(Array.isArray(content)){
            this.set(topicId, ++content[0], content[1]);
        }
        return 0;
    },

/**
 * Add 1 to downvote number by topic id.
 */
    downVote: function(topicId){
        let content = cacheServices.read(voteKey, topicId);
        if(Array.isArray(content)){
            this.set(topicId, content[0], ++content[1]);
        }
        return 0;
    },

/**
 * Remove vote number by topic id.
 */
    remove: function(topicId){
        cacheServices.delete(voteKey, topicId);
        this.removeTopTopics(topicId);
        return 0;
    },

/**
 * Remove topicId from topTopic cache and re-sorting.
 */
    removeTopTopics: function(topicId){
        let topTopicsContent = cacheServices.readAll(top20Topics);
        if(!topTopicsContent.hasOwnProperty(topicId)){
            return 0;
        }

        let voteContent = cacheServices.readAll(voteKey);
        delete topTopicsContent[topicId];
        var leftKeyNumbers = Object.keys(topTopicsContent)
                                .sort((x, y) => topTopicsContent[y] - topTopicsContent[x]).slice(0, 20);
        if(leftKeyNumbers.length < Object.keys(voteContent).length){
            let newOrder = {};
            this.getVotesByUpVoteDesc().slice(0, 20)
            .reduce(function(x, y){x = newOrder; x[y] = voteContent[y][0];}, newOrder);
            topTopicsContent = newOrder;
        }
        cacheServices.updateAll(top20Topics, topTopicsContent);
        return 0;
    }

};


module.exports = voteServices;