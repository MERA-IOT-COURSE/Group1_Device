const mqtt = require('mqtt')
const EventEmitter = require('events').EventEmitter

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
        this.client = mqtt.connect(`mqtt://${ip}:${port}`)
        this.listeningTopics = new Set([`init_${backendId}`])

        this.client.on('connect', () => {
            this.listeningTopics.forEach(topic => {
                client.subscribe(topic)
            });
        })

        this.client.on('message', (topic, message) => {
            console.log(`[${topic}] ${message.toString()}`)
            
            if (!this.listeningTopics.has(topic))
                return

            parsedMessage = this.parseMessage(message)

            hander = this.messageHandlers[parsedMessage.mid]
            if (hander) {
                handler.validate(message)
                this.emit(handler.getSignalName, message)
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

    addNewTopic(topic) {
        this.listeningTopics.add(topic)
        client.subscribe(topic)
    }
}

module.exports = ServerProtocol