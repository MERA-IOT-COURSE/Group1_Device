const express = require('express')
const log = require('../../Common/logger/log')(module)

const deviceController = require('../controllers/device')
const sensorDataController = require('../controllers/sensor-data')

const router = express.Router()

router.get('/', function(req, res) {
    deviceController.findAll((err, devices) => {
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
    
    deviceController.findOne(deviceId, (err, device) => {
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
    
    deviceController.findOne(deviceId, (err, device) => {
        if (err) {
            log.error(err)
            return
        }

        if (!device) {
            log.error(`Device ${deviceId} not found, cannot get sensors!`)
            return
        }

        let result = []

        for (let sensor of device.sensors) {

            let actions = []
            for (let action of sensor.actions) {
                actions.push({
                    id: action.id,
                    name: action.name
                })
            }

            result.push({
                id: sensor.id,
                name: sensor.type,
                actions: actions
            })
        }

        res.json(result)
    })
})

router.get('/:deviceId/sensors/:sensorId', function(req, res) {
    const deviceId = req.params.deviceId
    const sensorId = req.params.sensorId
    sensorDataController.findLastValue(deviceId, sensorId, (err, value) => {
        if (err) {
            log.error(err)
            return
        }

        if (!value) {
            log.error(`No value for ${sensorId} of device ${deviceId}!`)
            return
        }

        res.json({
            value: parseInt(value, 10)
        })
    })
})

module.exports = router