var log = require('./log')(module)
var app = require('./app')

// TODO: use nconf
app.set('port', 3000)

var server = app.listen(app.get('port'), function () {
  log.info('Express server listening on port ' + app.get('port'))
})