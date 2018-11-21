const fs = require('fs')
const Sensor = require('./sensor')
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
    }

    getHardwareId() {
        return this.hardwareId
    }

    getActions() {
        return []
    }

    getSensors() {
        return []
    }

    getName() {
        return "group1"
    }
}

module.exports = new Device()