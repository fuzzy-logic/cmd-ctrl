

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

    getAll(typename) {
        const results = [];
        for (const key in this.repository) {
            results.push(this.repository[key]);
        }
        return results;
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