const assert = require('assert');
const cmdCtrl = require('../index.js');

/**
 * Test CMD+CTRL public package creation and use
 * 
 */
describe('test command processor', function () {

    const newUserCmd = {name: 'CreateUser', type: 'user', data: {id: 101, name: 'gawain', email: 'gawain@gmail.com'}};
    const updateUserProfileCmd = {name: 'UpdateUserProfile', id: 101, type: 'user', data: {name: 'gavin', email: 'gavin@gmail.com'}};
    const deleteUserCmd = {name: 'DeleteUser', id: 101, type: 'user'};
        
        it('test name change command', async function () {

            var commandProcessor = cmdCtrl.init(__dirname + '/commands');
            var repository = cmdCtrl.getInMemRepository();
            assert.ok(commandProcessor);

            const newUserResult = await commandProcessor.process(newUserCmd);
            // assert repository has  entity from newUserCmd command 
            assert.equal(true, newUserResult.ok);
            //console.dir(newUserResult);
            const repoUserGawain = repository.getById(newUserCmd.data.id, newUserCmd.type);
            assert.equal('gawain', repoUserGawain.name);
            assert.equal('gawain@gmail.com', repoUserGawain.email);

            const updateProfileResult = await commandProcessor.process(updateUserProfileCmd);
            // assert repository has updated entity from updateUserProfileCmd command 
            assert.equal(true, updateProfileResult.ok);
            //console.dir(updateProfileResult);
            const repoUserGavin = repository.getById(updateUserProfileCmd.id, updateUserProfileCmd.type);
            assert.equal('gavin', repoUserGavin.name);
            assert.equal('gavin@gmail.com', repoUserGavin.email);

            const deleteUserResult = await commandProcessor.process(deleteUserCmd);
            // assert repository has deleted entity from deleteUserCmd command 
            assert.equal(true, deleteUserResult.ok);
            //console.dir(deleteUserResult);
            const deletedUser = repository.getById(deleteUserCmd.id, deleteUserCmd.type);
            assert.equal(undefined, deletedUser);
        });

    });