const SensorData = require('../models/sensor-data')

module.exports = {
    add(deviceId, message, callback) {
        // add new data to db
        let sensorData = new SensorData({
            deviceId: deviceId,
            sensorId: message.sensor_id,
            value: message.value,
            ts: message.ts
        })

        sensorData.save(callback)
    },

    findLastValue(deviceId, sensorId, callback) {
        SensorData.findOne({
            deviceId: deviceId,
            sensorId: sensorId
        })
        .sort('-ts')
        .exec((err, sensorData) => {
            if (!err && !sensorData) {
                err = 'No value for `${sensorId}` sensor!'
            }
            let value = !err ? sensorData.value : null
            callback(err, value)
        })
    }
}