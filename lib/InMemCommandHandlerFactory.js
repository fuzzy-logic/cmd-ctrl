const requireDir = require('require-dir');
require('sexylog');



/**
 * default impolementation for directory based command handler
 * 
 */
class InMemCommandHandlerFactory {
    
    constructor(commandHandlers) {
        this.commandHandlers  = commandHandlers;    
    }

    getCommandHandler(commandName) {
        for (const index in this.commandHandlers) {
            const commandHandler = this.commandHandlers[index];
            if (commandName === commandHandler.name) {
                return commandHandler;
            }
        }
    }

    getAllHandlers() {
        return this.commandHandlers;
    }
}
    
module.exports = InMemCommandHandlerFactory;