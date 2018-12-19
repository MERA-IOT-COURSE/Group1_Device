const mqtt = require('mqtt')
const EventEmitter = require('events').EventEmitter
const log = require('../../Common/logger/log')(module)

class MessageHandler 
{
    constructor(signalName) {
        this.signalName = signalName
    }

    validate() {
        // TODO:
        // Add schema for validation
        return true
    }
}

class BaseProtocol extends EventEmitter {
    constructor() {
        super()
        this.messageHandlers = {
            [BaseProtocol.REGISTER]: new MessageHandler(BaseProtocol.REGISTER),
            [BaseProtocol.REGISTER_RESP]: new MessageHandler(BaseProtocol.REGISTER_RESP),
            [BaseProtocol.SENSOR_DATA]: new MessageHandler(BaseProtocol.SENSOR_DATA),
            [BaseProtocol.REQ_DEVICE_ACTION]: new MessageHandler(BaseProtocol.REQ_DEVICE_ACTION),
            [BaseProtocol.REQ_SENSOR_ACTION]: new MessageHandler(BaseProtocol.REQ_SENSOR_ACTION),
            [BaseProtocol.RESP_DEVICE_ACTION]: new MessageHandler(BaseProtocol.RESP_DEVICE_ACTION),
            [BaseProtocol.RESP_SENSOR_ACTION]: new MessageHandler(BaseProtocol.RESP_SENSOR_ACTION)
        }
    }
}

BaseProtocol.REGISTER = 'REGISTER'
BaseProtocol.REGISTER_RESP = 'REGISTER_RESP',
BaseProtocol.SENSOR_DATA = 'SENSOR_DATA',
BaseProtocol.REQ_DEVICE_ACTION = 'REQ_DEVICE_ACTION',
BaseProtocol.REQ_SENSOR_ACTION = 'REQ_SENSOR_ACTION',
BaseProtocol.RESP_DEVICE_ACTION = 'RESP_DEVICE_ACTION',
BaseProtocol.RESP_SENSOR_ACTION = 'RESP_SENSOR_ACTION'


class ServerProtocol extends BaseProtocol {
    constructor(ip, port, backendId) {
        super()
        var brokerUrl = `mqtt://${ip}:${port}`
        this.client = mqtt.connect(brokerUrl)
        this.listeningTopics = new Set([`init_${backendId}`])

        this.client.on('connect', () => {
            log.info(`Connected to the broker: ${brokerUrl}`)
            this.listeningTopics.forEach(topic => {
                this.client.subscribe(topic)
            });
        })

        this.client.on('message', (topic, message) => {
            log.verbose(`[in][${topic}] ${message.toString()}`)
            
            if (!this.listeningTopics.has(topic))
                return

            let parsedMessage = this.parseMessage(message)
            if (parsedMessage) {
                this.emit(
                    parsedMessage.signalName, 
                    this.getDeviceIdFromTopic(topic), 
                    parsedMessage.data
                )
            }
            else {
                log.error('Cannot parse message!')
            }
        })
    }

    parseMessage(message) {
        // Must be:
        // {
        //     "mid": <message id>,
        //     "data": <payload specific for mid>
        // }
        const parsedMessage = JSON.parse(message)

        var handler = this.messageHandlers[parsedMessage.mid]
        if (handler && handler.validate(message)) {
            return {
                signalName: handler.signalName,
                data: JSON.parse(message).data
            }
        }

        return null
    }

    sendMessage(deviceId, type, payload) {
        const message = {
            mid: type,
            data: payload
        }

        const topic = `dev_${deviceId}`
        const messageString = JSON.stringify(message)

        const handler = this.messageHandlers[type]
        if (handler && handler.validate(message)) {
            log.verbose(`[out][${topic}] ${messageString}`)
            this.client.publish(topic, messageString)
        }
        else {
            if (!handler) {
                log.error(`Message handler for ${type} not found!`)
            }
            else {
                log.error(`Invalid message format: ${messageString}`)
            }
        }
    }

    addNewDevice(id) {
        const topic = `be_${id}`

        this.listeningTopics.add(topic)
        this.client.subscribe(topic)
    }

    getDeviceIdFromTopic(topic) {
        if (topic.startsWith('init'))
            return null

        const prefix = 'be_'

        if (topic.indexOf(prefix) == 0) {
            topic = topic.slice(prefix.length)
        }
        return topic
    }
}

module.exports = ServerProtocol