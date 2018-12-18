// {
//   "version": <Version of supported protocol>,
//   "hw_id": <Unique hw_id of device>,
//   "name": <Default device name in free form>,
//   "sensors": [Array of sensor objects supported by device],
//   "actions": [Optional array of device actions]
// }

// {
//     "id": <Unique id of sensor>,
//     "type": <Sensor type>,
//     "actions": [Optional array of sensor specific actions]
// }

const mongoose = require('mongoose')

const deviceSchema = mongoose.Schema({
    hardwareId: String,
    name: String
})

module.exports = mongoose.model('Device', deviceSchema)