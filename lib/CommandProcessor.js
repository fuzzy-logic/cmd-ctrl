const clone = require('clone');
require('sexylog');


/**
 * CQRS Stype syncrhonous command processor for mutating state of domain entities
 * 
 * 
 *  submit command
 *        │
 *        ∨     
 *  ╔════════════════════╗
 *  ║ [CommandProcessor] ║
 *  ║ get cmd handler    ║===> "ERROR: invalid command name (no handler found)"
 *  ╚════════════════════╝
 *        |
 *     command 
 *        │
 *        ∨
 *  ╔═══════════════════╗
 *  ║ [CommandHandler]  ║
 *  ║ validate command  ║===> "ERROR: command data rejected"
 *  ╚═══════════════════╝
 *        |
 *        │                    ╔══════════════╗
 *        |--if (entity.id)--> ║ [Repository] ║
 *        |                    ║ get entity   ║===> "ERROR: invalid id"
 *        |                    ╚══════════════╝                 
 *        |                          |
 *        |                        entity
 *        |                          |
 *        |                          v
 *        |                  ╔══════════════════════╗
 *        |                  ║   [CommandHandler]   ║
 *        |----------------- ║ pre-check invariants ║===> "ERROR: entity rejected"
 *        |                  ╚══════════════════════╝
 *    command (+ entity)
 *        │
 *        ∨
 * ╔════════════════╗
 * ║ pre-conditions ║===> "rejected"
 * ╚════════════════╝
 *        │
 *  command (+ entity copy)
 *        │
 *        ∨
 *  ╔═══════════════╗
 *  ║  handle cmd   ║===> ERROR: handle failure
 *  ╚═══════════════╝
 *        │                             ╔══════════════╗
 *  new entity state ---- commamnd -->  ║ emit event   ║
 *        |                             ╚══════════════╝
 *        ∨
 *   ╔════════╗
 *   ║ commit ║
 *   ╚════════╝
 *        |
 *     status: ok
 *        |
 *        v
 * 
 */
class CommandProcessor {


    constructor(repository, commandHandlerFactory) {
        this.repository = repository;
        this.commandHandlerFactory = commandHandlerFactory;
    }

    process(command) {
        logger.trace('process() command='  + JSON.stringify(command));
        const result = {ok: true, err: undefined, entity: undefined};
       
        try {
            const commandHandler =  this.findCommandHandler(command);
            const entity = this.getEntity(command.id, command.type);            
            commandHandler.validateCommand(command);
            commandHandler.preValidateEntity(entity, command);
            logger.debug('executing commandhandler ' + command.name);
            const newEntity = commandHandler.execute(command, entity);
            commandHandler.postValidateEntity(newEntity, command);
            commitChanges(newEntity, entity, this.repository);
            result.entity = newEntity;
        } catch (err) {
            logger.error('[CommandProcessor] ERROR=' + err);
            logger.error('[CommandProcessor] ' + err.stack);
            result.ok = false;
            result.err = err;
        }
        return result;
    }

    getEntity(id, type) {
        if (id && type) {
            const entity = this.repository.getById(id, type);
            if (id && ! entity) throw new Error('entity not found for id=' + id);
            logger.trace('getEntity() found existing enity='  + JSON.stringify(entity));
            const copy = clone(entity);
            return copy;
        }  else {
            logger.trace('getEntity() returning undefined entity as no id or type. id=' + id + ', type=' + type);
        }
        return;
    }

    findCommandHandler(command) {
       const commandHandler =  this.commandHandlerFactory.getCommandHandler(command.name);
       if (commandHandler === undefined) throw new Error('command handler for name "' + command.name + '" not found');
       logger.trace('found commandHandler='  + JSON.stringify(commandHandler));
       return commandHandler;
    }
}

/**
 * Performs cmd+ctrl logic to either save new entity state, or if undefined then delete from the repository
 * 
 * @param {*} entity entity domain object to delete
 * @param {*} repository repository object to use for save or delete operation
 */
function commitChanges(newEntity, existingEntity, repository) {
    logger.debug('commiting changes for new entity state=' + JSON.stringify(newEntity));
    try {
        if (newEntity === undefined  && existingEntity != undefined) {
            logger.trace('[cmd+ctrl] deleting existing entity id=' + existingEntity.id);
            repository.delete(existingEntity);
        } else if (newEntity != undefined) {
            logger.trace('[cmd+ctrl] saving newEntity ' + JSON.stringify(newEntity));
            repository.save(newEntity);
        }  else {
            throw new Error('unable to commit entity due to invalid given state: ' + JSON.stringify(existingEntity));
        }
    } catch (err) {
        throw new Error(err);
    }

}


module.exports = CommandProcessor;