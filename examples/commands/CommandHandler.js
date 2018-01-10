
const uuidv5 = require('uuid/v5');


/**
 * Base CommandHandler object
 * 
 */
class CommandHandler {
    
        constructor(command, entity) { 
            this.command = command;
            this.entity = entity;
            this.checkSubclasses();

        }

        /**
         * ensures subclasses have required methods/functions for command handler functionality
         */
        checkSubclasses() {
            const implMethopds = ['validateCommand', 'preValidateEntity', 'postValidateEntity', 'execute'];
            const _this = this;
            implMethopds.forEach(function (methodName) {     
                if (_this[methodName] === undefined) {
                    throw new TypeError('Subclasses of CommandHandler must implement method "' + methodName +'() {}"');
                }
            });
        }

        /**
         * domain wide uuid generator
         */
        genId() {
            return uuidv5('dst.bp.com', uuidv5.DNS); 
        }

    }


 module.exports = CommandHandler;
    