const ServerProtocol = require('./protocol/server-protocol')
const log = require('../Common/logger/log')(module)
const config = require('../Common/config/config')

class DeviceHandler {
    constructor() {
        var ip = config.get('broker:ip') || 'localhost'
        var port = config.get('broker:port') || '1883'
        var backendId = config.get('broker:backendId') || 'default'

        this.serverProtocol = new ServerProtocol(ip, port, backendId)

        this.serverProtocol.on('register', (topic, message) => this.onRegister(message))

        log.info(`Starting mqtt broker on ${ip}:${port} with backendId=${backendId}`)
    }

    onRegister(message) {
        log.info('Got register from %s', message)
    }
}

module.exports = DeviceHandler
