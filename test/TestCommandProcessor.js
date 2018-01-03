const CommandProcessor = require('../lib/CommandProcessor.js');
var assert = require('assert');




describe('test command processor', function () {

    
        it('process name change command', async function () {
            const user = {id: 1, type: 'user', name: 'bob', email: 'bob@gmail.com'};
            repository = createRepository();
            repository.save(user);
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

            const status = await commandProcessor.process(command);
            assert.equal(true, status.ok);
            assert.equal(command.data.name, status.result.name);
            assert.equal(command.data.email, status.result.email);
        });




});


const createCommandHandlerFactory = function(commands) {
    return {
        getCommandHandler: function(command) {
            return commands[command];
        }
    }
}






const createRepository = function() {
    var repo = {};
    return {
            getById: function(id, type) {
                return repo[type + id];
            },
            save: function(entity) {
                repo[entity.type + entity.id] = entity;  
                return true;
            }
        };

    }; 