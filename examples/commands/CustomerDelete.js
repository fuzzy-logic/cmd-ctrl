var CommandHandler = require('./CommandHandler');

/**
 * COmmand handler to create a new customer
 * 
 */
class CustomerDelete extends CommandHandler {
    
        constructor() {
            super();
        }

        validateCommand(command) {
            // nothing to pre-validate for command as this is a delete action
        }

        preValidateEntity(entity) {
            if (! entity) throw new Error('must be an existing entity to update');
            if (! entity.id) throw new Error('must be an existing entity id to update');
        }

        postValidateEntity(entity) {
            if (entity) throw new Error('entity should be undefined in order to delete');
        }

        execute(command, entity) {
            return undefined;
        }
}


 module.exports =  new CustomerDelete();
    