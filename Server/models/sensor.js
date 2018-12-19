// {
//     "id": <Unique id of sensor>,
//     "type": <Sensor type>,
//     "actions": [Optional array of sensor specific actions]
// }

const mongoose = require('mongoose')
const Action = require('./action')

const sensorSchema = mongoose.Schema({
    id: String,
    type: String,
    actions: [Action]
})

module.exports = mongoose.model('Sensor', sensorSchema)