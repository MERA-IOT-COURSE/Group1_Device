const ServerProtocol = require('../protocol/server-protocol')
const log = require('../../Common/logger/log')(module)
const config = require('../../Common/config/config')
const db = require('../db/mongoose')

const deviceController = require('../controllers/device')
const sensorDataController = require('../controllers/sensor-data')

class DeviceTransmitter {
    constructor() {
        const ip = config.get('broker:ip') || 'localhost'
        const port = config.get('broker:port') || '1883'
        const backendId = config.get('broker:backendId') || 'default'
        
        this.registrationDelay = 60
        this.serverProtocol = new ServerProtocol(ip, port, backendId)

        this.serverProtocol.on(ServerProtocol.REGISTER, (deviceId, message) => this.onRegister(message))
        this.serverProtocol.on(ServerProtocol.SENSOR_DATA, (deviceId, message) => this.onSensorData(deviceId, message))
        this.serverProtocol.on(ServerProtocol.RESP_DEVICE_ACTION, (deviceId, message) => this.onDeviceActionResponse(deviceId, message))
        this.serverProtocol.on(ServerProtocol.RESP_SENSOR_ACTION, (deviceId, message) => this.onSensorActionResponse(deviceId, message))

        log.info(`Starting mqtt broker on ${ip}:${port} with backendId=${backendId}`)
    }

    onRegister(message) {
        const deviceId = message.hw_id
        log.info('Got register from %s', deviceId)

        let status = 'OK'

        deviceController.createOrUpdate(deviceId, message, (err, device) => {
            if (err) {
                log.error('Cannot save device! %s', err)
                return
            }
            
            // TODO: send notification to frontend
            this.serverProtocol.addNewDevice(deviceId)
            this.serverProtocol.sendMessage(deviceId, ServerProtocol.REGISTER_RESP, {
                status: status,
                registration_delay: this.registrationDelay
            })
        })
    }

    onSensorData(deviceId, message) {
        sensorDataController.add(deviceId, message, (err, sensorData) => {
            if (err) {
                log.error('Cannot save sensor data! %s', err)
                return
            }

            // TODO: send notification to frontend
        })
    }

    onDeviceActionResponse(deviceId, message) {
        // TODO: send notification to frontend
    }

    onSensorActionResponse(deviceId, message) {
        // TODO: send notification to frontend
    }

    sendDeviceAction(deviceId, action) {
        this.serverProtocol.sendMessage(deviceId, ServerProtocol.REQ_DEVICE_ACTION, {
            id: action
        })
    }

    sendSensorAction(deviceId, sensorId, action) {
        this.serverProtocol.sendMessage(deviceId, ServerProtocol.REQ_SENSOR_ACTION, {
            id: action,
            sensor_id: sensorId
        })
    }
}

module.exports = new DeviceTransmitter
