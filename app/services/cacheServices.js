/**
 * Contain for cache.
 */
var memCache = {};

/**
 * Fixed key name.
 */
const indexType = 'index', topicIndex = 'topicIndex';

var cacheServices = {

/**
 * Get topic index from cache.
 */
    getTopicIndex: function(){
        if(memCache[indexType] && typeof memCache[indexType][topicIndex] === 'number'){
            return memCache[indexType][topicIndex];
        }else{
            this.create(indexType);
            memCache[indexType][topicIndex] = 0;
            return 0;
        }
    },

/**
 * Add 1 to topic index.
 */
    addTopicIndex: function(){
        memCache[indexType][topicIndex]++;
    },

/**
 * Create a object by type name for store in memory cache.
 */
    create: function(type){
        if(!memCache[type]){
            memCache[type] = {};
        }
    },

/**
 * Read from cache by type name and the key.
 */
    read: function(type, key){
        if(memCache[type] && memCache[type][key]) {
            return memCache[type][key];
        }
    },

/**
 * Read from cache by type name.
 */
    readAll: function(type){
        if(memCache[type]) {
            return memCache[type];
        }
    },

/**
 * Update object value by type.
 */
    updateAll: function(type, value){
        if(memCache[type]) {
            memCache[type] = value;
        } else {
            this.create(type);
            memCache[type] = value;
        }
    },

/**
 * Update object value by type name, the key, and value.
 */
    update: function(type, key, value){
        if(memCache[type]) {
            memCache[type][key] = value;
        }else{
            this.create(type);
            memCache[type][key] = value;
        }
    },

/**
 * Delete from memory by type name and the key.
 */
    delete: function(type, key){
        if(memCache[type] && memCache[type][key]) {
            memCache[type][key] = null;
            delete memCache[type][key];
        }
    }

};

module.exports = cacheServices;