const fs = require('fs')
const DHT11HumiditySensor = require('./sensors/dht11-humidity')
const DHT11TemperatureSensor = require('./sensors/dht11-temperature')
const Action = require('./action')

function parseHardwareId() {
    const cpuinfoPath = "/proc/cpuinfo"

    var cpuinfo = fs.readFileSync(cpuinfoPath, 'utf-8')
    var hardwareId = null

    // Serial       : 0000000043da31c3
    var hardwareIdRegexp = /Serial\s*:\s*(\w+)/g;
    
    var match = hardwareIdRegexp.exec(cpuinfo)
    if (match) {
        hardwareId = match[1]
    }

    return hardwareId
}

class Device {
    constructor() {
        this.hardwareId = parseHardwareId();
        
        // Default actions:
        // TODO: implement actions
        this.actions = [
            new Action("custom.reboot", "Reboot", {}),
            new Action("custom.shutdown", "Shutdown", {})
        ]

        // Sensors:
        // TODO: scan RPi to get a real list of sensors 
        this.sensors = [
            new DHT11HumiditySensor(),
            new DHT11TemperatureSensor()
        ]
    }

    getHardwareId() {
        return this.hardwareId
    }

    getActions() {
        return this.actions
    }

    getSensors() {
        return this.sensors
    }

    getName() {
        return "group1"
    }

    runAction(actionId) {
        if (actionId >= this.actions.length)
            return
        
        var action = this.actions[actionId]
        action.run()
    }
}

module.exports = new Device()