const express = require('express')
const log = require('../../Common/logger/log')(module)
const deviceController = require('../controllers/device')

const router = express.Router()

router.get('/', function(req, res) {
    res.end('devices')
    const devicesQuery = deviceController.findAll()
    log.debug(devices)
    // for (let device of devices) {
    //     log.debug(device)
    // }
})

router.get('/:deviceId', function(req, res) {
    res.end('devices/id')
    log.debug('/id')
})

module.exports = router