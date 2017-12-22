const cmdCtrl = require('../lib/CommandProcessor.js');
var assert = require('assert');

describe('test command processor', function () {
    
        it('process simple command', async function () {
            const command = {};
            const status = await cmdCtrl.process(command);
            assert.equal(true, status);
        });

});