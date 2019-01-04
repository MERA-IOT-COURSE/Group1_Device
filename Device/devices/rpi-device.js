const fs = require('fs')
const cp = require("child_process")
const DHT11HumiditySensor = require('../sensors/dht11-humidity')
const DHT11TemperatureSensor = require('../sensors/dht11-temperature')
const LedSensor = require('../sensors/led-sensor')
const Action = require('../app/action')
const Device = require('./device')

function parseHardwareId() {
    const cpuinfoPath = "/proc/cpuinfo"
    var cpuinfo = fs.readFileSync(cpuinfoPath, 'utf-8')

    // Serial       : 0000000043da31c3
    var hardwareIdRegexp = /Serial\s*:\s*(\w+)/g;
    var match = hardwareIdRegexp.exec(cpuinfo)

    return match ? match[1] : null
}

var device = new Device("group1", parseHardwareId())

// Sensors:
// TODO: get a list of sensors with parameters from config
const DHT11GpioPin = 4
device.addSensor(new DHT11HumiditySensor(DHT11GpioPin))
device.addSensor(new DHT11TemperatureSensor(DHT11GpioPin))
device.addSensor(new LedSensor(17, 27, 22))

// Actions:
device.addAction(new Action("custom.reboot", "Reboot", () => {
    cp.exec("reboot")
}))
device.addAction(new Action("custom.shutdown", "Shutdown", () => {
    cp.exec("halt")
}))

module.exports = device