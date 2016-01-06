var util = require('./util.js');
var request = require('request').defaults({
    baseUrl: 'https://api.medium.com/'
});

var pickInputs = {
       'userId': 'userId'
    }, pickOutputs = {
        'id': { keyName: 'data', fields: ['id'] },
        'description': { keyName: 'data', fields: ['description'] },
        'name': { keyName: 'data', fields: ['name'] },
        'url': { keyName: 'data', fields: ['url'] },
        'imageUrl': { keyName: 'data', fields: ['imageUrl'] }
    };

module.exports = {

    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var inputs = util.pickInputs(step, pickInputs),
            token = dexter.environment('medium_access_token');

        if (!token)
            return this.fail('A [medium_access_token] environment variable is required for this module');

        if (!inputs.userId)
            return this.fail('A [userId] need for this module.');

        request.get({
            uri: '/v1/users/' + inputs.userId+ '/publications',
            auth: { bearer: token },
            json: true
        }, function (error, response, body) {
            if (error)
                this.fail(error);
            else
                this.complete(util.pickOutputs(body, pickOutputs));
        }.bind(this));
    }
};
