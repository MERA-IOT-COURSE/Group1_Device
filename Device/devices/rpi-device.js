const fs = require('fs')
const DHT11HumiditySensor = require('../sensors/dht11-humidity')
const DHT11TemperatureSensor = require('../sensors/dht11-temperature')
const Action = require('../action')
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
// TODO: scan RPi to get a real list of sensors 
device.addSensor(new DHT11HumiditySensor())
device.addSensor(new DHT11TemperatureSensor())
        
// Default actions:
// TODO: implement actions
device.addAction(new Action("custom.reboot", "Reboot", {}))
device.addAction(new Action("custom.shutdown", "Shutdown", {}))

module.exports = device