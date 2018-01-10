/**
 * 
 * CMD+CTRL Command handler to delete a user given correct comamnd
 * 
 */



 /**
  * return null to delete existing entity
  */
exports.execute = function(command, entity) {
    return;
};


exports.validateCommand = function(command) {
    //
}

exports.preValidateEntity = function(entity) {
    // nothing to validate as we are creating new user
}


exports.postValidateEntity = function(entity) {
    // nothing to validate as we are creating new user
}