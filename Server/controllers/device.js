const Device = require('../models/device')
const Sensor = require('../models/sensor')
const Action = require('../models/action')

function isWithoutData(sensorType) {
    return sensorType.startsWith('led.')
}

module.exports = {
    createOrUpdate(deviceId, deviceData, callback) {
        // add device to db
        let sensors = []
        for (let sensor of deviceData.sensors) {

            let actions = []

            if ('actions' in sensor) {
                for (let action of sensor.actions) {
                    actions.push(new Action({
                        id: action.id,
                        name: action.name
                    }))
                }
            }

            sensors.push(new Sensor({
                id: sensor.id,
                type: sensor.type,
                actions: actions,
                withoutData: isWithoutData(sensor.id)
            }))
        }

        let actions = []
        if ('actions' in deviceData) {
            for (let action of deviceData.actions) {
                actions.push(new Action({
                    id: action.id,
                    name: action.name
                }))
            }
        }

        Device.findOneAndUpdate({
            deviceId: deviceId
        }, {
            deviceId: deviceId,
            name: deviceData.name,
            actions: actions,
            sensors: sensors
        }, {
            upsert: true
        },
        callback)
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
