const Device = require('./device')
const Action = require('../action')
const FakeSensor = require('../sensors/fake-sensor')

var device = new Device("fake_name", "fake_hardware_id")

const sensorDataSendIntervalMs = 1000
device.addSensor(new FakeSensor(sensorDataSendIntervalMs))

device.addAction(new Action("custom.reboot", "Reboot", {}))
device.addAction(new Action("custom.shutdown", "Shutdown", {}))

module.exports = device