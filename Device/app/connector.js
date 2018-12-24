const log = require('../../Common/logger/log')(module)
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
        const brokerUrl = `mqtt://${ip}:${port}`
        log.info(`Connecting to broker ${brokerUrl}...`)

        this.client = mqtt.connect(brokerUrl)
        this.device = device
        this.backendId = backendId
        this.registerTimeoutMs = 60 * 1000
        
        this.inTopic = `dev_${this.device.getHardwareId()}`
        this.outTopic = `be_${this.device.getHardwareId()}`

        // Register the device: send registration immediately and then by timeout 
        this.client.on('connect', () => {
            log.info("Connected to broker", this.registerTimeoutMs)
            
            this.sendRegistration()
            this.registrationTimer = setInterval(() => { this.sendRegistration() }, this.registerTimeoutMs)
            this.client.subscribe(this.inTopic)
        })

        this.client.on('message', (topic, message) => {
            this.onMessage(topic, message)
        })

        // Register sensors listeners
        device.getSensors().forEach(sensor => {
            sensor.on('data', (sensor, value, ts) => {
                this.sendSensorData(sensor, value, ts)
            })
        })
    }

    sendRegistration() {
        var message = buildMessage(
            "REGISTER",
            buildInitData(this.device)
        )

        this.sendMessage(`init_${this.backendId}`, message)
    }

    sendSensorData(sensor, value, ts) {
        var sensorData = {
            "sensor_id": sensor.getId(),
            "value": value,
            "ts": ts
        }

        var message = buildMessage(
            "SENSOR_DATA",
            sensorData
        )
        
        this.sendMessage(this.outTopic, message)
    }

    sendSensorActionResponse(sensor, action, status, data) {
        var responseData = {
            "id": action.getId(),
            "sensor_id": sensor.getId(),
            "status": status,
        }

        if (data) {
            responseData.data = data
        }

        var message = buildMessage(
            'RESP_SENSOR_ACTION',
            responseData
        )
        this.sendMessage(this.outTopic, message)
    }

    sendDeviceActionResponse(action, status, data) {
        var responseData = {
            "id": action.getId(),
            "status": status,
        }

        if (data) {
            responseData.data = data
        }

        var message = buildMessage(
            'RESP_DEVICE_ACTION',
            responseData
        )
        this.sendMessage(this.outTopic, message)
    }

    sendMessage(topic, data) {
        var message = JSON.stringify(data)
        this.client.publish(topic, message)
        log.debug(`Sending message:  [${topic}] ${message}`)
    }

    onMessage(topic, message) {
        log.debug(`Incoming message: [${topic}] ${message.toString()}`)

        if (topic != this.inTopic)
            return

        // Must be:
        // {
        //     "mid": <message id>,
        //     "data": <payload specific for mid>
        // }
        const parsedMessage = JSON.parse(message)
        switch (parsedMessage.mid) {
            case 'REGISTER_RESP':
                this.onRegistrationResponse(parsedMessage.data)
                break
            case 'REQ_DEVICE_ACTION':
                this.onDeviceAction(parsedMessage.data)
                break
            case 'REQ_SENSOR_ACTION':
                this.onSensorAction(parsedMessage.data)
                break
        }
    }

    onRegistrationResponse(data) {
        if (data.status != 'OK') {
            log.error(`Registration failure! Reason: ${data.status}`)
            return
        }

        if ('registration_delay' in data) {
            this.registerTimeoutMs = data['registration_delay'] * 1000 // convert to ms
            clearInterval(this.registrationTimer)
            this.registrationTimer = setInterval(() => { this.sendRegistration() }, this.registerTimeoutMs)
        }
    }

    onDeviceAction(data) {
        const actions = this.device.getActions()
        const action = actions.find((action) => { return action.getId() == data['id'] })

        if (action) {
            let [err, data] = action.run()
            let status = err ? `FAIL: ${err}` : "OK"
            this.sendDeviceActionResponse(action, status, data)
        }
    }

    onSensorAction(data) { 
        const sensors = this.device.getSensors()
        const sensor = sensors.find((sensor) => { return sensor.getId() == data['sensor_id'] })

        if (!sensor)
            return
            
        const actions = sensor.getActions()
        const action = actions.find((action) => { return action.getId() == data['id'] })

        if (action) {
            let [err, data] = action.run()
            let status = err ? `FAIL: ${err}` : "OK"
            this.sendSensorActionResponse(sensor, action, status, data)
        }
    }
}

module.exports.ConnectionHandler = ConnectionHandler