var CommandHandler = require('./CommandHandler');

/**
 * Command handler to create a new customer
 */
class CustomerCreate extends CommandHandler {
    
        constructor() {
            super();
        }

        validateCommand(command) {
            // make sure command has semblance of valid data:
            if (command.data.name === undefined) throw new Error('command.data.name must be defined');
            if (command.data.email === undefined) throw new Error('command.data.email must be defined');
        }

        preValidateEntity(entity) {
            // nothing to validate as this command handler creates a new object
        }

        postValidateEntity(entity, command) {
            if (entity.name != command.data.name) throw new Error('entity.name is not same as command.data.name');
            if (entity.email != command.data.email) throw new Error('entity.email is not same as command.data.email');
        }

        execute(command, entity) {
            const newUser = {};
            newUser.id = super.genId();
            newUser.name =  command.data.name;
            newUser.email = command.data.email;
            newUser.type = command.type;
            return newUser;
        }
}

//module.exports = {CustomerCreate: CustomerCreate};

module.exports = new CustomerCreate();








    