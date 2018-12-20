var log = require('../../Common/logger/log')(module)
var express = require('express')
var bodyParser = require('body-parser')
var path = require('path')

// Routes:
var deviceRoutes = require('../routes/devices')

var app = express()

app.use(bodyParser.json())
app.use(bodyParser.urlencoded({ extended: false }))
app.use(express.static(path.join(__dirname, '..', 'frontend')))

app.use('/api/devices', deviceRoutes)

// Catch 404 and forward to error handler
app.use((req, res, next) => {
    res.status(404)
    log.debug('%s %d %s', req.method, res.statusCode, req.url)
    res.json({
        error: 'Not found'
    })
})

// Error handlers
app.use((err, req, res, next) => {
    res.status(err.status || 500)
    log.error('%s %d %s', req.method, res.statusCode, err.message)
    res.json({
        error: err.message
    })
})

module.exports = app