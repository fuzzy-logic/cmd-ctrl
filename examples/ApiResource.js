

/**
 * 
 * REST API Resource object manager.
 * 
 * Currently helps generate REST API linsk for object operations
 * 
 */
class ApiResource {
    
        constructor(entity) {
            if (! entity || ! entity.id) throw new Error('must supply entity with id for new ApiResource for ' + JSON.stringify(entity));
            this.id = entity.id;
            this.resourceName = entity.type;
            this._links = { };
            this.apibase = '';
            this.addGetById();
        }

        addGetById() {
            this._links['getById_' + this.resourceName] = {
                href: this.apibase + '/' + this.resourceName + '/' + this.id,
                method: 'GET',
              }
              return this;
        }

        getLinks() {
            return this._links;
        }

        url() {
            return this.getLinks()['getById_' + this.resourceName];
        }
    }


    module.exports = ApiResource;
    