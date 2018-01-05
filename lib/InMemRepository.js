

/**
 * acts as an in-mem repository for test dev purposes
 * 
 */
class InMemeoryRepository {

    constructor() {
        this.repository = {};
    }

    getById(id, typename) {
        return this.repository[typename + id];
    }

    save(entity) {
        this.repository[entity.type + entity.id] = entity;  
        return true;
    }

    delete(entity) {
        this.repository[entity.type + entity.id] = undefined;  
        return true;
    }

}

module.exports = InMemeoryRepository;