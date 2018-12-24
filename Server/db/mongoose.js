const mongoose = require('mongoose')
const log = require('../../Common/logger/log')(module)
const config = require('../../Common/config/config')

// TODO: fix auth process, now it is disabled
//const url = `mongodb://${config.get('db:login')}:${config.get('db:password')}@${config.get('db:host')}:${config.get('db:port')}/${config.get('db:name')}`

const url = `mongodb://${config.get('db:host')}:${config.get('db:port')}/${config.get('db:name')}`
mongoose.connect(url, { useNewUrlParser: true })

const db = mongoose.connection

db.on('error', (err) => {
    log.error('Connection error: %s', err.message)
})

db.once('open', () => {
    log.info('Connected to MongoDB on url %s', url)
});

module.exports = mongoose