const Action = require('../app/action')
const EventEmitter = require('events').EventEmitter

class Sensor extends EventEmitter {
    constructor(id, type) {
        super()
        this.id = id
        this.type = type

        // TODO: implement the actions and add support for custom actions
        this.actions = [
            new Action("common.read", "Read value of sensor", () => {})
        ]
    }
    
    getId() {
        return this.id
    }

    getType() {
        return this.type
    }

    getActions() {
        return this.actions
    }
}

module.exports = Sensor