const config = require('./app/config')
const connector = require('./app/connector')

const deviceModulePath = config.get('fake-device') ? './devices/fake-device' : './devices/rpi-device'
const device = require(deviceModulePath)

var connection = new connector.ConnectionHandler(
    config.get('ip'),
    config.get('port'),
    device,
    config.get('backendId')
) 