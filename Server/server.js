var mqtt = require('mqtt')
var client = mqtt.connect('mqtt://localhost:1883')
 
client.on('connect', function () {
    client.subscribe('#')
})
 
client.on('message', function (topic, message) {
    console.log(`${topic}: ${message.toString()}`)
})