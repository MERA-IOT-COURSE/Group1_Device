const Device = require('../models/device')

module.exports = {
    createOrUpdate(deviceId, message, callback) {
        // add device to db
        let device = new Device({
            deviceId: deviceId,
            name: message.name
        })
        device.save(callback)
    },

    findAll() {
        return Device.find()
    }
}
