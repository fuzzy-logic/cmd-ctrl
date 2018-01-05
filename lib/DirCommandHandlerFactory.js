const requireDir = require('require-dir');


/**
 * default impolementation for directory based command handler
 * 
 */
class DirCommandHandlerFactory {
    
    constructor(path) {
        this.commands = requireDir(path);
    }


    getCommandHandler(commandName) {
        const commandHandler = this.commands[commandName];
        return commandHandler;
    }

    
}
    
module.exports = DirCommandHandlerFactory;