/**
 * 
 * CMD+CTRL Command handler to create a new user (and client generated id) given correct comamnd
 * 
 */

exports.execute = function(command, entity) {
    const newUser = {};
    newUser.id = command.data.id;
    newUser.name =  command.data.name;
    newUser.email = command.data.email;
    newUser.type = command.type;
    return newUser;
};