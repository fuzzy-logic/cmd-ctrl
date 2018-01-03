var clone = require('clone');

class CommandProcessor {


    constructor(repository, commandHandlerFactory) {
        this.repository = repository;
        this.commandHandlerFactory = commandHandlerFactory;
    }

    process(command) {
        const status = {ok: true, err: undefined, result: undefined};
        const commandHandler =  this.findCommandHandler(command);
        
        if (! this.checkCommandOk(commandHandler)) {
            status.ok = false;
            status.err = 'invalid command handler for command ' + JSON.stringify(command);
        } else {
            const entity = repository.getById(command.id, command.type);
            const copy = clone(entity);
            const result = commandHandler.execute(command, copy);
            status.result = result;
        }
        return status;
    }

    checkCommandOk(commandHandler) {
        var commandHandlerOk = true;
        if (! commandHandler) commandHandlerOk = false;
        return commandHandlerOk;
    }

    findCommandHandler(command) {
       return this.commandHandlerFactory.getCommandHandler(command.name);
    }
}


module.exports = CommandProcessor;