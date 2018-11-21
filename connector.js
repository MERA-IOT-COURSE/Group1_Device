const mqtt = require('mqtt')
const version = "1.0"

function buildActionsData(actions) {
    var actionsData = []

    actions.forEach(action => {
        actionsData.push({
            "id": action.getId(),
            "name": action.getName()
        })
    })

    return actionsData
}

function buildSensorsData(sensors) {
    var sensorsData = []

    sensors.forEach(sensor => {
        sensorsData.push({
            "id": sensor.getId(),
            "type": sensor.getType(),
            "actions": buildActionsData(sensor.getActions())
        })
    })

    return sensorsData
}

function buildInitData(device) {
    var initData = {
        "version": version,
        "hw_id": device.getHardwareId(),
        "sensors": buildSensorsData(device.getSensors()),
        "actions": buildActionsData(device.getActions()),
        "name": device.getName()
    }

    return initData
}

class ConnectionHandler {
    constructor(ip, port, device, backend_id) {
        this.client = mqtt.connect(`mqtt://${ip}:${port}`)

        var message = JSON.stringify({
            "mid": "REGISTER",
            "data": buildInitData(device)
        })

        this.client.on('connect', () => {
            this.client.publish(`init_${backend_id}`, message)
            console.log(`Init called with: ${message}`)
        })
    }
}

module.exports.ConnectionHandler = ConnectionHandler