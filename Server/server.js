var log = require('./log')(module)
const DeviceHandler = require('./device-handler')
const app = require('./app')

// TODO: use nconf
app.set('port', 3000)

var server = app.listen(app.get('port'), function () {
  log.info('Express server listening on port ' + app.get('port'))
})

var deviceHandler = new DeviceHandler()