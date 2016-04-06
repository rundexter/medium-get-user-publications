var _     = require('lodash')
  , agent = require('superagent')
  , q     = require('q')
;

module.exports = {

    /**
     * The main entry point for the Dexter module
     *
     * @param {AppStep} step Accessor for the configuration for the step using this module.  Use step.input('{key}') to retrieve input data.
     * @param {AppData} dexter Container for all data used in this workflow.
     */
    run: function(step, dexter) {
        var authorId = dexter.provider('medium').data('id')
          , token = dexter.provider('medium').credentials('access_token')
          , deferred = q.defer()
        ;

        agent.get('https://api.medium.com/v1/users/'+authorId+'/publications')
          .set('Authorization', 'Bearer '+token)
          .type('json')
          .end(deferred.makeNodeResolver())
        ;

      deferred
        .promise
        .then(function(result) {
           return _.get(result, 'body.data');
        })
        .then(this.complete.bind(this))
        .catch(this.fail.bind(this))
      ;
   }
};
