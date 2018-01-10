var clone = require('clone');

/**
 * Base entity object
 * 
 */
class Entity {
    
        constructor() {
            this.id = undefined;
            this.type = undefined;
        }

        url() {
            return this.getLinks()['getById_' + this.resourceName];
        }
    }


    module.exports = Entity;
    