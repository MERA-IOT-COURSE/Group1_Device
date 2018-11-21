const Action = require('./action')

class Sensor {
    constructor(id, type) {
        this.id = id
        this.type = type

        // TODO: implement the actions and add support for custom actions
        this.actions = [
            new Action("common.read", "Read value of sensor", {})
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