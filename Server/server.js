const log = require('../Common/logger/log')(module)
const config = require('../Common/config/config')
const app = require('./app/app')
const deviceTransmitter = require('./app/device-transmitter')

app.set('port', config.get('port') || 3000)

const server = app.listen(app.get('port'), function () {
  log.info('Express server listening on port ' + app.get('port'))
})