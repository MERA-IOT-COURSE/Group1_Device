const SensorData = require('../models/sensor-data')

function add(deviceId, message, callback) {
    // add new data to db
    let sensorData = new SensorData({
        deviceId: deviceId,
        sensorId: message.sensor_id,
        value: message.value,
        ts: message.ts
    })

    sensorData.save(callback)
}

module.exports = {
    add: add
}