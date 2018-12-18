const config = require('./config')

const deviceModulePath = config.get('fake-device') ? './devices/fake-device' : './devices/rpi-device'
const device = require(deviceModulePath)
const connector = require('./connector')

var connection = new connector.ConnectionHandler(
    config.get('ip'),
    config.get('port'),
    device,
    config.get('backendId')
) 