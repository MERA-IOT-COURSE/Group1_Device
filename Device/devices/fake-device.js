const Device = require('./device')
const Action = require('../action')
const FakeSensor = require('../sensors/fake-sensor')

var getMaxRandomInt = () => Math.floor(Number.MAX_SAFE_INTEGER * Math.random())
const device = new Device('fake_device', `hw_${getMaxRandomInt()}`)

const sensorDataSendIntervalMs = 1000
device.addSensor(new FakeSensor(sensorDataSendIntervalMs))

device.addAction(new Action("custom.reboot", "Reboot", () => {}))
device.addAction(new Action("custom.shutdown", "Shutdown", () => {}))

module.exports = device