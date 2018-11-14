const fs = require('fs')

class Device {
    getHardwareId() {
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

    getActions() {
        return []
    }

    getName() {
        return "group1"
    }
}

module.exports = new Device()