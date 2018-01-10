const assert = require('assert');
const cmdCtrl = require('../index.js');


//Commands and entities to mutate

const newUserCmd = {name: 'CreateUser', type: 'user', data: {name: 'gawain', email: 'gawain@gmail.com'}};
const updateUserProfileCmd = {name: 'UpdateUserProfile', id: undefined, type: 'user', data: {name: 'gavin', email: 'gavin@gmail.com'}};
const deleteUserCmd = {name: 'DeleteUser', id: undefined, type: 'user'};
const userBob = {id: 1, type: 'user', name: 'bob', email: 'bob@gmail.com'};
const userJim = {id: 2, type: 'user', name: 'jim', email: 'jim@gmail.com'};
const userEve = {id: 3, type: 'user', name: 'eve', email: 'eve@gmail.com'};

/**
 * Test CMD+CTRL public package creation and use
 * 
 */
describe('test command processor', function () {

    const customInMemRepo = customInMemRepository();
    const customInMemCommandHandlerFactory = inMemCommandHandlerFactory(testCommandHandlers());

    before(function() {
        // runs before all tests in this block
        customInMemRepo.save(userBob);
        customInMemRepo.save(userJim);
        customInMemRepo.save(userEve);
    });
        
    /**
     * execute series of commands representing typical lifecycle of an entity:
     * 1.) create user
     * 2.) update user profile
     * 3.) delete user
     *  
     */
    it('user lifecycle with default in-mem+dir cmd-ctrl implementation', async function () {

        var commandProcessor = cmdCtrl.init(__dirname + '/commands');
        var repository = cmdCtrl.getInMemRepository();
    

        ///// STEP 1: Create new user ///////////////////////////////////////
        const newUserResult = await commandProcessor.process(newUserCmd);
        assert.equal(true, newUserResult.ok);
        // assert command state changes
        const repoUserGawain = repository.getById(newUserResult.entity.id, newUserCmd.type);
        assert.equal('gawain', repoUserGawain.name);
        assert.equal('gawain@gmail.com', repoUserGawain.email);


        ///// STEP 2: Update user profile details /////////////////////////
        updateUserProfileCmd.id = newUserResult.entity.id;
        const updateProfileResult = await commandProcessor.process(updateUserProfileCmd);
        assert.equal(true, updateProfileResult.ok);
        // assert command state changes
        const repoUserGavin = repository.getById(updateUserProfileCmd.id, updateUserProfileCmd.type);
        assert.equal('gavin', repoUserGavin.name);
        assert.equal('gavin@gmail.com', repoUserGavin.email);


        ///// STEP 3: Delete user ////////////////////////////////////////
        deleteUserCmd.id = newUserResult.entity.id;
        const deleteUserResult = await commandProcessor.process(deleteUserCmd);
        assert.equal(true, deleteUserResult.ok);
        // assert command state changes
        const deletedUser = repository.getById(deleteUserCmd.id, deleteUserCmd.type);
        assert.equal(undefined, deletedUser);

    });

    it('custom repo and handler cmd-ctrl implementation', async function () {

                    cmdCtrl.setRepository(customInMemRepo);
                    cmdCtrl.setHandlerFactory(customInMemCommandHandlerFactory);

                    var commandProcessor = cmdCtrl.init();
                    assert.ok(commandProcessor);
        
                    const newUserResult = await commandProcessor.process(newUserCmd);
                    // assert repository has  entity from newUserCmd command 
                    console.dir(newUserResult);
                    assert.equal(true, newUserResult.ok);
                    //console.dir(newUserResult);
                    const repoUserGawain = customInMemRepo.getById(newUserResult.entity.id, newUserCmd.type);
                    assert.equal('gawain', repoUserGawain.name);
                    assert.equal('gawain@gmail.com', repoUserGawain.email);
                    
    });

});










/**
 * create a bunch of custom command handlers for in memeory command handler factory implementation
 */
function testCommandHandlers() {

    const createUserCommandHandler = {
        execute: function(command, entity) {
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

    const updateUserProfileCommand = {
        execute: function(command, entity) {
            entity.name =  command.data.name;
            entity.email = command.data.email;
            return entity;
        },
        validateCommand: function() {},
        preValidateEntity: function() {},
        postValidateEntity: function() {}
    }

    const deleteUserCommand = {
        execute: function(command, entity) {
            return ;
        },
        validateCommand: function() {},
        preValidateEntity: function() {},
        postValidateEntity: function() {}
    }

    // Link up commands to command haldners for in mem implementation:
    commands = {};
    commands[newUserCmd.name] = createUserCommandHandler;
    commands[updateUserProfileCmd.name] = updateUserProfileCommand;
    commands[deleteUserCmd.name] = deleteUserCommand;


    return commands;
}



/**
 * Sample in-memeory repository to test custom setting from cmd+ctl public npm api
 */
function customInMemRepository() {
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



/**
 * Sample in-memeory command handler factory to test custom setting from cmd+ctl public npm api
 * 
 * @param {*} commands Literal object with name -> CommandHandler mappings
 */
function inMemCommandHandlerFactory(commands) {
    return {
        getCommandHandler: function(command) {
            return commands[command];
        }
    }
}