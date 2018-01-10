require('sexylog');

/**
 * This index file contains the function used when published to npm
 * 
 */

 const InMemRepository = require('./lib/InMemRepository.js');
 const DirCommandHandlerFactory = require('./lib/DirCommandHandlerFactory.js');
 const InMemCommandHandlerFactory = require('./lib/InMemCommandHandlerFactory.js');
 const CmdCtrl = require('./lib/CommandProcessor.js');


exports.init = function(config, repo) {

    logger.debug('cmd+ctrl config type=' + typeof config);

    if (config instanceof Array) {
        logger.info("cm+ctrl init() config=Array");
        const commandHandlers = config;
        commandHandlerFactory = new InMemCommandHandlerFactory(commandHandlers);

    } else if (typeof config === 'string') {
        logger.info("cm+ctrl init() config=Array");
        const path = config;
        commandHandlerFactory = new DirCommandHandlerFactory(path);
        
    }  else if (typeof config === 'object') {
        logger.info("cm+ctrl init() config=object");
        const factory = config;
        commandHandlerFactory = factory;

    } else {
        const msg = "cm+ctrl init() unable to auto detect config type " + typeof config + ". No command factory config specified, this is bad."
        logger.error(msg);
        throw new Error(msg);
    }

    if (! repo) repo = new InMemRepository();
    return new CmdCtrl(repo, commandHandlerFactory);
}



