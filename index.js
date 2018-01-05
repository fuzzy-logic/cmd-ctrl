/**
 * This index file contains the function used when published to npm
 * 
 */

var CmdCtrl = require('./lib/CommandProcessor.js');

 var repository = inMemRepository();
 var commandHandlerFactory;

exports.customRepository = function(repository) {
    console.log("CMD+CTRL add repo");
}

exports.customHandlers = function(factory) {
    commandHandlerFactory = factory;
}

exports.getInMemRepository = function() {
    return repository;
}

exports.init = function(path) {
    if (! commandHandlerFactory) {
        if (path) {
            commandHandlerFactory = dirCommandHandlerFactory(path);
        } else {
            throw new Error('either supply init(path) for comamnd handler dir or supply customer comamnd handler factory');
        }
        
    }
    return new CmdCtrl(repository, commandHandlerFactory);
}


/**
 * Sample in-memeory repository for testing and dev
 */
function inMemRepository() {
    var repo = {};
    return {
            getById: function(id, type) {
                return repo[type + id];
            },
            save: function(entity) {
                repo[entity.type + entity.id] = entity;  
                return true;
            },
            delete(entity) {
                repo[entity.type + entity.id] = undefined;  
                return true;
            }
        };

    }; 




/**
 * Sample in-memeory command handler factory using literal object to store command handlers for depenedency
 * injection to command processor
 * 
 * @param {*} path path to search (recusively) for COmmandHanlders (file name is used as command handler name) 
 */
function dirCommandHandlerFactory(path) {
    const requireDir = require('require-dir');
    const commands = requireDir(path);
    //console.log('************ dirCommandHandlerFactory("' + path + '")');
    //console.dir(commands);
    return {
        getCommandHandler: function(command) {
            return commands[command];
        }
    }
}


