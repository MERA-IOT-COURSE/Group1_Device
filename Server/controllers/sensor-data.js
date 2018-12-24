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

    findLastValues(deviceId, sensorId, count, callback) {
        SensorData.find({
            deviceId: deviceId,
            sensorId: sensorId
        })
        .sort('-ts')
        .limit(count)
        .exec((err, sensorData) => {
            if (!err && !sensorData) {
                err = 'No value for `${sensorId}` sensor!'
            }
            callback(err, sensorData)
        })
    }
}