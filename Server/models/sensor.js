// {
//     "id": <Unique id of sensor>,
//     "type": <Sensor type>,
//     "actions": [Optional array of sensor specific actions]
// }

const mongoose = require('mongoose')
const actionSchema = require('./action').schema

const sensorSchema = mongoose.Schema({
    id: String,
    type: String,
    actions: [actionSchema]
})

module.exports = mongoose.model('Sensor', sensorSchema)
module.exports.schema = sensorSchema