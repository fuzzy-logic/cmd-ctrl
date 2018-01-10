require('sexylog');

/**
 * This index file contains the function used when published to npm
 * 
 */

 const InMemRepository = require('./lib/InMemRepository.js');
 const DirCommandHandlerFactory = require('./lib/DirCommandHandlerFactory.js');
 const DirCommandHandlerClassFactory = require('./lib/DirCommandHandlerClassFactory.js');
 const CmdCtrl = require('./lib/CommandProcessor.js');

 var repository = new InMemRepository();
 var commandHandlerFactory;

exports.setRepository = function(newRepo) {
    //console.log("CMD+CTRL adding custom user defined repoitory");
    repository = newRepo;

}

exports.setHandlerFactory = function(factory) {
    //console.log("CMD+CTRL adding custom user defined commandHandlerFactory");
    commandHandlerFactory = factory;
}

exports.getInMemRepository = function() {
    return repository;
}

exports.init = function(path) {
    if (! commandHandlerFactory) {
        if (path) {
            commandHandlerFactory = new DirCommandHandlerFactory(path);
        } else {
            throw new Error('either supply init(path) for comamnd handler dir or supply customer comamnd handler factory');
        }
    }
    logger.silly('cmd+ctrl running...');
    return new CmdCtrl(repository, commandHandlerFactory);
}



