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

class ServerProtocol extends EventEmitter {
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
            log.verbose(`[${topic}] ${message.toString()}`)
            
            if (!this.listeningTopics.has(topic))
                return

            var parsedMessage = this.parseMessage(message)

            var handler = this.messageHandlers[parsedMessage.mid]
            if (handler) {
                handler.validate(message)
                this.emit(
                    handler.signalName, 
                    this.getDeviceIdFromTopic(topic), 
                    message
                )
            }
        })

        this.messageHandlers = {
            'REGISTER': new MessageHandler('register'),
            'SENSOR_DATA': new MessageHandler('sensor data'),
            'RESP_DEVICE_ACTION': new MessageHandler('device action response'),
            'RESP_SENSOR_ACTION': new MessageHandler('sensor action response')
        }
    }

    parseMessage(message) {
        // Must be:
        // {
        //     "mid": <message id>,
        //     "data": <payload specific for mid>
        // }
        return JSON.parse(message)
    }

    addNewDevice(id) {
        const topic = `be_${id}`

        this.listeningTopics.add(topic)
        client.subscribe(topic)
    }

    getDeviceIdFromTopic(topic) {
        if (topic.startsWith('init'))
            return null

        return topic.split('_')[1]
    }
}

module.exports = ServerProtocol