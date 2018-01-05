/**
 * 
 * CMD+CTRL Command handler to update a user profile given correct comamnd
 * 
 */

exports.execute = function(command, entity) {
    entity.name =  command.data.name;
    entity.email = command.data.email;
    return entity;
};