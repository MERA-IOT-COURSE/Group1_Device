const ServerProtocol = require('./protocol/server-protocol')
const log = require('./log')(module)

class DeviceHandler {
    constructor() {
        var ip = '10.42.0.11'
        var port = '1883'
        var backendId = 'group1'
        this.serverProtocol = new ServerProtocol(ip, port, backendId)

        this.serverProtocol.on('register', (topic, message) => this.onRegister(message))

        log.info(`Listening mqtt broker on ${ip}:${port} with backendId=${backendId}`)
    }

    onRegister(message) {
        log.info('Got register from %s', message)
    }
}

module.exports = DeviceHandler
