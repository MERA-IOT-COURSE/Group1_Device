const device = require('./device')
const connector = require('./connector')

const ip = '10.42.0.10'
const port = '1883'
const backend_id = 'master'

var connection = new connector.ConnectionHandler(ip, port, device, backend_id) 