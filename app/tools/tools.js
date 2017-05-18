
var tools = {

    /**
     * Check input string is number or not.
     */
    checkIsNumber: function(input){
        let regexRule = new RegExp("^[0-9]+$");
        return regexRule.test(input);
    }
};

module.exports = tools;