const express = require('express')
const log = require('../../Common/logger/log')(module)

const deviceController = require('../controllers/device')
const sensorDataController = require('../controllers/sensor-data')
const deviceTransmitter = require('../app/device-transmitter')

const router = express.Router()

router.get('/', (req, res) => {
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

router.get('/:deviceId/*', (req, res, next) => {
    const deviceId = req.params.deviceId

    deviceController.findOne(deviceId, (err, device) => {
        if (err) {
            log.error(err)
            next(err)
        }

        if (!device) {
            err = `Device ${deviceId} not found!`
            log.error(err)
            next(err)
        }

        req.device = device
        next()
    })
})

router.get('/:deviceId/actions', (req, res) => {
    const device = req.device

    let result = []
    for (let action of device.actions) {
        result.push({
            id: action.id,
            name: action.name
        })
    }

    res.json(result)
})

router.get('/:deviceId/sensors', (req, res) => {
    const device = req.device

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

router.get('/:deviceId/sensors/:sensorId', (req, res) => {
    const deviceId = req.params.deviceId
    const sensorId = req.params.sensorId
    const valuesCount = req.params.count || 10

    sensorDataController.findLastValues(deviceId, sensorId, valuesCount, (err, sensorData) => {
        if (err) {
            log.error(err)
            return
        }

        if (!sensorData) {
            log.error(`No value for ${sensorId} of device ${deviceId}!`)
            return
        }

        let values = sensorData.map((data) => { return parseInt(data.value, 10); }).reverse()

        res.json({
            value: values
        })
    })
})

router.get('/:deviceId/actions/:actionId', (req, res) => {
    const deviceId = req.params.deviceId
    const actionId = req.params.actionId
    
    deviceTransmitter.sendDeviceAction(deviceId, actionId, (response) => {
        res.json({
            "res": response ? response.status : "Failed!"
        })
    })
})

router.get('/:deviceId/sensors/:sensorId/actions/:actionId', (req, res) => {
    const deviceId = req.params.deviceId
    const sensorId = req.params.sensorId
    const actionId = req.params.actionId
    
    deviceTransmitter.sendSensorAction(deviceId, sensorId, actionId, (response) => {
        res.json({
            "res": response ? response.status : "Failed!"
        })
    })
})


module.exports = router