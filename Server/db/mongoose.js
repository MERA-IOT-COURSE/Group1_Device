const mongoose = require('mongoose')
const log = require('../../Common/logger/log')(module)
const config = require('../../Common/config/config')

mongoose.connect(config.get('db:uri'))

const db = mongoose.connection

db.on('error', (err) => {
    log.error('Connection error:', err.message)
})

db.once('open', () => {
    log.info('Connected to DB!')
});

module.exports = mongoose