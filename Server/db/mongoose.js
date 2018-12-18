const mongoose = require('mongoose')
const log = require('../../Common/logger/log')(module)
const config = require('../../Common/config/config')

const url = config.get('db:url') || 'mongodb://localhost/devices'
mongoose.connect(url, { useNewUrlParser: true })

const db = mongoose.connection

db.on('error', (err) => {
    log.error('Connection error: %s', err.message)
})

db.once('open', () => {
    log.info('Connected to MongoDB on url %s', url)
});

module.exports = mongoose