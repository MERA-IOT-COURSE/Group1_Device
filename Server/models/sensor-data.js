// {
//     "sensor_id": <Unique identity of sensor>,
//     "value": <Value on sensor>,
//     "ts": <Optional, current unix time in seconds when value was read by device>
// }

const mongoose = require('mongoose')

const sensorDataSchema = mongoose.Schema({
    deviceId: String,
    sensorId: String,
    values: String,
    ts: Number
})

module.exports = mongoose.model('SensorData', sensorDataSchema)