'use strict';

var authConfig = require('./waterlock-phone-auth').authConfig;

/**
 * TODO these can be refactored later
 * @type {Object}
 */

module.exports = function(Auth, engine){
  var def = Auth.definition;

  //Check the config file to get the scope
  if(authConfig.scope !== 'undefined'){
    return generateScope(authConfig.scope, engine)
  } else {
    if(typeof def.email !== 'undefined'){
      return generateScope('email', engine);
    }else if(typeof def.username !== 'undefined'){
      return generateScope('username', engine);
    }else if(typeof def.phone !== 'undefined'){
      return generateScope('phone', engine);
    }else{
      var error = new Error('Auth model must have either an email, phone or username attribute');
      throw error;
    }
  }
};

function generateScope(scopeKey, engine){
  return {
    type: scopeKey,
    engine: engine,
    getUserAuthObject: function(attributes, req, cb){
      var attr = {password: attributes.password};
      attr[scopeKey] = attributes[scopeKey];

      var criteria = {};
      criteria[scopeKey] = attr[scopeKey];

      if(authConfig.createOnNotFound){
        this.engine.findOrCreateAuth(criteria, attr, cb);
      }else{
        this.engine.findAuth(criteria, cb);
      }
    }
  };
}
