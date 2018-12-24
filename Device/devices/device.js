class Device {
    constructor(name, hardwareId) {
        this.hardwareId = hardwareId
        this.name = name
        this.actions = []
        this.sensors = []
    }

    addSensor(sensor) {
        this.sensors.push(sensor)
    }
    
    addAction(action) {
        this.actions.push(action)
    }

    getHardwareId() {
        return this.hardwareId
    }

    getActions() {
        return this.actions
    }

    getSensors() {
        return this.sensors
    }

    getName() {
        return this.name
    }

    runAction(actionId) {
        const action = this.actions.find((action) => { return action.getId() == actionId })
        return action ? action.run() : null
    }
}

module.exports = Device