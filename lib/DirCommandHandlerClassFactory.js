const requireDir = require('require-dir');
require('sexylog');



/**
 * default impolementation for directory based command handler
 * 
 */
class DirCommandHandlerClassFactory {
    
    constructor(path) {
        this.commands  = requireDir(path);    
    }

    getCommandHandler(commandName) {
        console.log('[DirCommandHandlerFactory] getCommandHandler("' + commandName + '") ');
        for (const key in this.commands) {
            if (commandName === key) {
                const commandHandlerClass = this.commands[key];
                try {
                    var commandHandlerInstance = new commandHandlerClass;
                    if (commandHandlerInstance) return commandHandlerInstance;
                } catch (err) {
    
                }
            }
        }
    }

    getAllHandlers() {
        const copyCommands = {};
        for (const key in this.commands) {
            const command = this.commands[key];
            copyCommands[key] = command;
        }
        return copyCommands;
    }

    
}
    
module.exports = DirCommandHandlerClassFactory;