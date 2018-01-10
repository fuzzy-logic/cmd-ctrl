const CommandProcessor = require('../lib/CommandProcessor.js');
const assert = require('assert');


/**
 * Test for CMD+CTRL core CommandProcessor object to snure correct processing of commands and entity state
 * 
 */
describe('test command processor', function () {

    const repository = require('../index.js').getInMemRepository(); // get the dev/test in mem repository implementation from cmdCtrl

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
            },
            validateCommand: function() {},
            preValidateEntity: function() {},
            postValidateEntity: function() {}
        }
        commands[command.name] = commandHandler;
        const commandProcessor = new CommandProcessor(repository, inMemCommandHandlerFactory(commands));

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
                },
                validateCommand: function() {},
                preValidateEntity: function() {},
                postValidateEntity: function() {}
            }
            commands[command.name] = commandHandler;
            const commandProcessor = new CommandProcessor(repository, inMemCommandHandlerFactory(commands));

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



        it('test delete user command', async function () {
            const command = {name: 'deleteUser', id: 1, type: 'user', data: {}};
            commands = {};
            const commandHandler = {
                execute: function(command, entity) {
                    // return undefined entity to delete
                    return;
                },
                validateCommand: function() {},
                preValidateEntity: function() {},
                postValidateEntity: function() {}
            }
            commands[command.name] = commandHandler;
            const commandProcessor = new CommandProcessor(repository, inMemCommandHandlerFactory(commands));

            const result = await commandProcessor.process(command);

            // assert command processor returned updated object in result
            assert.equal(true, result.ok);
            assert.equal(undefined, result.entity);

            // assert command processor didn't mutate original object
            assert.equal('bob', userBob.name);
            assert.equal('bob@gmail.com', userBob.email);

            // assert repository has latest entity from command mutation
            const deletedUser = repository.getById(command.data.id, command.type);
            assert.equal(undefined, deletedUser);

        });
   


        it('test command processor fails with missing command handler', async function () {
            const command = {name: 'createUser', type: 'user', data: {name: 'sally', email: 'sally@gmail.com'}}
            commands = {};
            const commandProcessor = new CommandProcessor(repository, inMemCommandHandlerFactory(commands));

            const result = await commandProcessor.process(command);

            assert.equal(false, result.ok);
            assert.equal('Error: command handler for name "createUser" not found', result.err);
        });



        it('test command processor fails with invalid command handler', async function () {
            const command = {name: 'createUser', type: 'user', data: {name: 'sally', email: 'sally@gmail.com'}}
            const commandHandler = {  }
            commands = {};
            commands[command.name] = commandHandler;
            const commandProcessor = new CommandProcessor(repository, inMemCommandHandlerFactory(commands));

            const result = await commandProcessor.process(command);

            assert.equal(false, result.ok);

        });



        it('test command processor fails deleting non-exsiting entity', async function () {
            const command = {name: 'deleteUser', id: 5, type: 'user', data: {}}; //no existing entity with id=5
            commands = {};
            const commandHandler = {
                execute: function(command, entity) {
                    // return undefined entity to delete
                    return;
                },
                validateCommand: function() {},
                preValidateEntity: function() {},
                postValidateEntity: function() {}
            }
            commands[command.name] = commandHandler;
            const commandProcessor = new CommandProcessor(repository, inMemCommandHandlerFactory(commands));

            const result = await commandProcessor.process(command);

            // assert command processor failed as expected
            assert.equal(false, result.ok);
            assert.equal('Error: entity not found for id=5', result.err);

        });

});








/**
 * Sample in-memeory command handler factory using literal object to store command handlers for depenedency
 * injection to command processor
 * 
 * @param {*} commands Liternal object of name -> CommandHandler mappings
 */
function inMemCommandHandlerFactory(commands) {
    return {
        getCommandHandler: function(command) {
            return commands[command];
        }
    }
}