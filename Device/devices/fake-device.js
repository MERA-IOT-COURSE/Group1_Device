const Device = require('./device')
const Action = require('../action')

var device = new Device("fake_name", "fake_hardware_id")

device.addAction(new Action("custom.reboot", "Reboot", {}))
device.addAction(new Action("custom.shutdown", "Shutdown", {}))

module.exports = device