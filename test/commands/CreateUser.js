const uuidv5 = require('uuid/v5');

/**
 * 
 * CMD+CTRL Command handler to create a new user (and client generated id) given correct comamnd
 * 
 */

exports.execute = function(command, entity) {
    const newUser = {};
    newUser.id = uuidv5('dst.bp.com', uuidv5.DNS); 
    newUser.name =  command.data.name;
    newUser.email = command.data.email;
    newUser.type = command.type;
    newUser.createdBy = command.source + '/' + command.name;
    //console.log('[CreateUserCommand] newUesr=' + JSON.stringify(newUser));
    return newUser;
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



const CreateUser = {
    execute: function() {

    },

    
} 