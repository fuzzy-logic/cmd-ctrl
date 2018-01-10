const assert = require('assert');
const CreateCustomer = require('./commands/CustomerCreate');


/**
 * Test CMD+CTRL public package creation and use
 * 
 */
describe('test create customer command handler', function () {

    const command = {type: 'Customer', name: 'CustomerCreate', data: {name: 'jimbo', email: 'jimbo@gmail.com'}};



    it('test create customer constructor', async function () {
        const commandHandler =  CreateCustomer;
        assert.ok(commandHandler);
    });

    it('test validates command', async function () {
        const commandHandler =  CreateCustomer;
        commandHandler.validateCommand(command);
    });

    it('test pre-validates entity', async function () {
        const commandHandler =  CreateCustomer;
        const entity  = {};
        commandHandler.preValidateEntity();
    });

    it('test post-validate entity', async function () {
        const commandHandler =  CreateCustomer;
        const entity  = {name: 'jimbo', email: 'jimbo@gmail.com'};
        commandHandler.postValidateEntity(entity, command);
    });

    it('test handler execution', async function () {
        const commandHandler =  CreateCustomer;
        const entity  = {name: 'jimbo', email: 'jimbo@gmail.com'};
        const result = commandHandler.execute(command);
        assert.ok(result);
    });

});






