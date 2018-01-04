const CommandProcessor = require('../lib/CommandProcessor.js');
var assert = require('assert');

describe('test command processor', function () {

        const repository = createRepository();
  
        const userBob = {id: 1, type: 'user', name: 'bob', email: 'bob@gmail.com'};
        const userJim = {id: 2, type: 'user', name: 'jim', email: 'jim@gmail.com'};
        const userEve = {id: 3, type: 'user', name: 'eve', email: 'eve@gmail.com'};

        before(function() {
            // runs before all tests in this block

            repository.save(userBob);
            repository.save(userJim);
            repository.save(userEve);
        });



        it('test name change command', async function () {
         
            const command = {name: 'changeUserName', id: 1, type: 'user', data: {name: 'bobby', email: 'bobby@gmail.com'}};
            commands = {};
            const commandHandler = {
                execute: function(command, entity) {
                    entity.name =  command.data.name;
                    entity.email = command.data.email;
                    return entity;
                }
            }
            commands[command.name] = commandHandler;
            const commandProcessor = new CommandProcessor(repository, createCommandHandlerFactory(commands));

            const result = await commandProcessor.process(command);

            // assert command processor returned updated object in result
            assert.equal(true, result.ok);
            assert.equal(userBob.id, result.entity.id);
            assert.equal(command.data.name, result.entity.name);
            assert.equal(command.data.email, result.entity.email);

            // assert command processor didn't mutate original object
            assert.equal('bob', userBob.name);
            assert.equal('bob@gmail.com', userBob.email);

            // assert repository has latest entity from command mutation
            const updatedUserBob = repository.getById(command.id, command.type);
            assert.equal('bobby', updatedUserBob.name);
            assert.equal('bobby@gmail.com', updatedUserBob.email);

        });


        it('test new user command', async function () {
            
               const command = {name: 'createUser', type: 'user', data: {id: 4, name: 'sally', email: 'sally@gmail.com'}};
               commands = {};
               const commandHandler = {
                   execute: function(command, entity) {
                       // entity will be undefined
                       const newUser = {};
                       newUser.id = command.data.id;
                       newUser.name =  command.data.name;
                       newUser.email = command.data.email;
                       newUser.type = command.type;
                       return newUser;
                   }
               }
               commands[command.name] = commandHandler;
               const commandProcessor = new CommandProcessor(repository, createCommandHandlerFactory(commands));
   
               const result = await commandProcessor.process(command);

               // assert command processor returned updated object in result
               assert.equal(true, result.ok);
               assert.equal(command.data.id, result.entity.id);
               assert.equal(command.data.name, result.entity.name);
               assert.equal(command.data.email, result.entity.email);
   
               // assert command processor didn't mutate original object
               assert.equal('bob', userBob.name);
               assert.equal('bob@gmail.com', userBob.email);
   
               // assert repository has latest entity from command mutation
               const createdUserSally = repository.getById(command.data.id, command.type);
               assert.equal('sally', createdUserSally.name);
               assert.equal('sally@gmail.com', createdUserSally.email);
   
           });
   



        it('command processor fails with missing command handler', async function () {
            const command = {name: 'createUser', type: 'user', data: {name: 'sally', email: 'sally@gmail.com'}}
            commands = {};
            const commandProcessor = new CommandProcessor(repository, createCommandHandlerFactory(commands));

            const result = await commandProcessor.process(command);

            assert.equal(false, result.ok);
            assert.equal('Error: command handler not found', result.err);
        });



        it('command processor fails with invalid command handler', async function () {
            const command = {name: 'createUser', type: 'user', data: {name: 'sally', email: 'sally@gmail.com'}}
            const commandHandler = {  }
            commands = {};
            commands[command.name] = commandHandler;
            const commandProcessor = new CommandProcessor(repository, createCommandHandlerFactory(commands));

            const result = await commandProcessor.process(command);

            assert.equal(false, result.ok);
            assert.equal('Error: invalid command handler no execute() function: {}', result.err);
        });

});


/**
 * Sample in-memeory command handler factory using literal object to store command handlers for depenedency
 * injection to command processor
 * 
 * @param {*} commands Liternal object of name -> CommandHandler mappings
 */
function createCommandHandlerFactory(commands) {
    return {
        getCommandHandler: function(command) {
            return commands[command];
        }
    }
}

/**
 * Sample in-memeory repository for dependency injection to command processor
 */
function createRepository() {
    var repo = {};
    return {
            getById: function(id, type) {
                return repo[type + id];
            },
            save: function(entity) {
                repo[entity.type + entity.id] = entity;  
                return true;
            },
            delete(entity) {
                repo[entity.type + entity.id] = undefined;  
                return true;
            }
        };

    }; 