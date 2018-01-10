const requireDir = require('require-dir');



/**
 * default impolementation for directory based command handler
 * 
 */
class DirCommandHandlerFactory {
    
    constructor(path) {
        this.commands  = requireDir(path);    
    }

    getCommandHandler(commandName) {
        return this.commands[commandName];
    }

    getAllHandlers() {
        return this.commands;
    }

}
    
module.exports = DirCommandHandlerFactory;