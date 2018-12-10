const device = require('./device')
const connector = require('./connector')
const configLoader = require('./config-loader')

var config = configLoader.load("config.json")

var connection = new connector.ConnectionHandler(config.ip, config.port, device, config.backendId) 