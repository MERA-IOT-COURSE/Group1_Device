class Sensor {
    constructor(id, type) {
        this.id = id
        this.type = type
    }
    
    getId() {
        return this.id
    }

    getType() {
        return this.type
    }
}

module.exports = Sensor