const Device = require('../models/device')

function createOrUpdate(deviceId, message, callback) {
    // add device to db
    let device = new Device({
        deviceId: deviceId,
        name: message.name
    })
    device.save(callback)
}

module.exports = {
    createOrUpdate: createOrUpdate
}