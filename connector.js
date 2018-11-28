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
    return {
        "version": version,
        "hw_id": device.getHardwareId(),
        "sensors": buildSensorsData(device.getSensors()),
        "actions": buildActionsData(device.getActions()),
        "name": device.getName()
    }
}

function buildMessage(messageId, data) {
    return {
        "mid": messageId,
        "data": data
    }
}

class ConnectionHandler {
    constructor(ip, port, device, backendId) {
        this.client = mqtt.connect(`mqtt://${ip}:${port}`)
        this.device = device
        this.backendId = backendId

        var message = JSON.stringify(buildMessage(
            "REGISTER",
            buildInitData(device)
        ))

        this.client.on('connect', () => {
            console.log("Connected to broker")
            this.client.publish(`init_${backendId}`, message)
            console.log(`Init called with: ${message}`)
        })

        // TODO: check response code.

        this.client.on('message', this.onMessage)

        // Register sensors listeners
        device.getSensors().forEach(sensor => {
            sensor.on('data', (sensor, value, ts) => {
                this.sendSensorData(sensor, value, ts)
            })
        })
    }

    onMessage(topic, message) {
        console.log(`Incoming message: [${topic}] ${message.toString()}`)
    }

    sendSensorData(sensor, value, ts) {
        var sensorData = {
            "sensor_id": sensor.getId(),
            "value": value,
            "ts": ts
        }

        var message = JSON.stringify(buildMessage(
            "SENSOR_DATA",
            sensorData
        ))

        this.client.publish(`be_${this.device.getHardwareId()}`, message)
        console.log(`Sensor data: ${message}`)
    }
}

module.exports.ConnectionHandler = ConnectionHandler