var clone = require('clone');


class CommandProcessor {


    constructor(repository, commandHandlerFactory) {
        this.repository = repository;
        this.commandHandlerFactory = commandHandlerFactory;
    }

    process(command) {
        const result = {ok: true, err: undefined, entity: undefined};
        const commandHandler =  this.findCommandHandler(command);
        
        try {
            this.checkCommandOk(commandHandler);
            const entity = this.repository.getById(command.id, command.type);
            const copy = clone(entity);
            const newEntity = commandHandler.execute(command, copy);
            persistOrDelete(newEntity, entity, this.repository);
            result.entity = newEntity;
        } catch (err) {
            result.ok = false;
            result.err = err;
        }
        return result;
    }

    checkCommandOk(commandHandler) {
        if (! commandHandler) throw new Error('command handler not found');
        if (typeof commandHandler.execute != 'function') throw new Error('invalid command handler no execute() function: ' + JSON.stringify(commandHandler)); 
    }

    findCommandHandler(command) {
       return this.commandHandlerFactory.getCommandHandler(command.name);
    }
}

/**
 * Performs cmd+ctrl logic to either save new entity state, or if undefined then delete from the repository
 * 
 * @param {*} entity entity domain object to delete
 * @param {*} repository repository object to use for save or delete operation
 */
function persistOrDelete(newEntity, oldEntity, repository) {
    if (newEntity) {
        //console.log('[cmd+ctrl] saving newEntity ' + JSON.stringify(newEntity));
        repository.save(newEntity);
    } else {
        //console.log('[cmd+ctrl] deleting oldEntity ' + JSON.stringify(oldEntity));
        repository.delete(oldEntity);
    }
}


module.exports = CommandProcessor;