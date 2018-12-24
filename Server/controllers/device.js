const Device = require('../models/device')
const Sensor = require('../models/sensor')
const Action = require('../models/action')

module.exports = {
    createOrUpdate(deviceId, deviceData, callback) {
        // add device to db

        let sensors = []
        for (let sensor of deviceData.sensors) {

            let actions = []
            for (let action of sensor.actions) {
                actions.push(new Action({
                    id: action.id,
                    name: action.name
                }))
            }

            sensors.push(new Sensor({
                id: sensor.id,
                type: sensor.type,
                actions: actions
            }))
        }

        let actions = []
        for (let action of deviceData.actions) {
            actions.push(new Action({
                id: action.id,
                name: action.name
            }))
        }

        const device = new Device({
            deviceId: deviceId,
            name: deviceData.name,
            actions: actions,
            sensors: sensors
        })
        device.save(callback)
    },

    findAll(callback) {
        Device.find().exec(callback)
    },

    findOne(id, callback) {
        return Device.findOne({
            deviceId: id
        })
        .exec(callback)
    }
}
