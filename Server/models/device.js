// {
//   "version": <Version of supported protocol>,
//   "hw_id": <Unique hw_id of device>,
//   "name": <Default device name in free form>,
//   "sensors": [Array of sensor objects supported by device],
//   "actions": [Optional array of device actions]
// }

const mongoose = require('mongoose')
const sensorSchema = require('./sensor').schema
const actionSchema = require('./action').schema

const deviceSchema = mongoose.Schema({
    deviceId: String,
    name: String,
    sensors: [sensorSchema],
    actions: [actionSchema]
})

module.exports = mongoose.model('Device', deviceSchema)
module.exports.schema = deviceSchema