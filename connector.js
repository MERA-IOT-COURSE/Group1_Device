const mqtt = require('mqtt')
const version = "1.0"

class ConnectionHandler {
    constructor(ip, port, device, backend_id) {
        this.client = mqtt.connect(`mqtt://${ip}:${port}`)

        var message = JSON.stringify({
            "mid": "REGISTER",
            "data": this.buildInitData(device)
        })

        this.client.on('connect', () => {
            this.client.publish(`init_${backend_id}`, message)
            console.log(`Init called with: ${message}`)
        })
    }

    buildInitData(device) {
        var initData = {
            "version": version,
            "hw_id": device.getHardwareId(),
            "sensors": [],
            "actions": [],
            "name": device.getName()
        }

        return initData
    }
}

module.exports.ConnectionHandler = ConnectionHandler