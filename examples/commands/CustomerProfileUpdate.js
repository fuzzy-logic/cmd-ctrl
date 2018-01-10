var CommandHandler = require('./CommandHandler');

/**
 * Base entity object
 * 
 */
class CustomerProfileUpdate extends CommandHandler {
    
    constructor() {
        super();
    }

    validateCommand(command) {
        // make sure command has semblance of valid data:
        if (command.data.name === undefined) throw new Error('command.data.name must be defined');
        if (command.data.email === undefined) throw new Error('command.data.email must be defined');
    }

    preValidateEntity(entity) {
        if (! entity) throw new Error('must be an existing entity to update');
        if (! entity.id) throw new Error('must be an existing entity id to update');
    }

    postValidateEntity(entity) {
        if (entity.name != command.data.name) throw new Error('entity.name is not same as command.data.name');
        if (entity.email != command.data.email) throw new Error('entity.email is not same as command.data.email');
    }

    execute(command, entity) {
        entity.name =  command.data.name;
        entity.email = command.data.email;
        return entity;
    }
}


 module.exports =  new CustomerProfileUpdate();
    