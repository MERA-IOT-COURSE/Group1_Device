const express = require('express')
const log = require('../../Common/logger/log')(module)
const deviceController = require('../controllers/device')

const router = express.Router()

router.get('/', function(req, res) {
    const devicesQuery = deviceController.findAll()
    
    devicesQuery.exec((err, devices) => {
        if (err) {
            log.error(err)
            return
        }

        let response = []
        for (let device of devices) {
            response.push({
                id: device.deviceId,
                name: device.name
            })
        }

        res.json(response)
    })
})

router.get('/:deviceId/actions', function(req, res) {
    const deviceId = req.params.deviceId
    const devicesQuery = deviceController.findOne(deviceId)
    
    devicesQuery.exec((err, device) => {
        if (err) {
            log.error(err)
            return
        }

        if (!device) {
            log.error(`Device ${deviceId} not found!`)
            return
        }

        let result = []
        for (let action of device.actions) {
            result.push({
                id: action.id,
                name: action.name
            })
        }

        res.json(result)
    })
})

router.get('/:deviceId/sensors', function(req, res) {
    const deviceId = req.params.deviceId
    const devicesQuery = deviceController.findOne(deviceId)
    
    devicesQuery.exec((err, device) => {
        if (err) {
            log.error(err)
            return
        }

        if (!device) {
            log.error(`Device ${deviceId} not found!`)
            return
        }

        let result = []

        for (let sensor of device.sensors) {
            result.push({
                id: sensor.id,
                name: sensor.type
            })
        }

        res.json(result)
    })
})

module.exports = router