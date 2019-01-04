const Action = require('../app/action')
const Utils = require('../app/utils')
const EventEmitter = require('events').EventEmitter

class Sensor extends EventEmitter {
    constructor(id, type, updateIntervalMs) {
        // Derived classes must implement readData() function

        super()
        this.id = id
        this.type = type

        this.updateTimer = null
        this.updateIntervalMs = updateIntervalMs || 1000

        this.actions = [
            new Action("common.read", "Read value", () => {
                this.sendData()
            }),
            new Action("common.update_on", "Update ON", () => {
                if (this.updateTimer !== null)
                    return

                this.updateTimer = setInterval(() => { this.sendData() }, this.updateIntervalMs)
            }),
            new Action("common.update_off", "Update OFF", () => {
                if (this.updateTimer === null)
                    return

                clearInterval(this.updateTimer)
                this.updateTimer = null
            })
        ]
    }

    sendData() {
        var data = this.readData()
        this.emit("data", this, data, Utils.getTimestamp())
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

    addAction(action) {
        this.actions.push(action)
    }

    runAction(actionId) {
        const action = this.actions.find((action) => { return action.getId() == actionId })
        return action ? action.run() : null
    }
}

module.exports = Sensor