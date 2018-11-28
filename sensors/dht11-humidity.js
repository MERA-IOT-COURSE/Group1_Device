const Sensor = require('./sensor')
const Utils = require('../utils')
const RpiDHTSensor = require('rpi-dht-sensor');

class DHT11HumiditySensor extends Sensor {
    constructor() {
        super("humidity", "sensor.humidity")

        this.dht = new RpiDHTSensor.DHT11(4);

        var sensor = this
        function readSensorData() {
            var data = sensor.dht.read();
            sensor.emit("data", sensor, data.humidity.toFixed(2), Utils.getTimestamp())
    
            // How it works:
            // console.log(sensor.id, 'Temperature: ' + data.temperature.toFixed(2) + 'C, ' +
            //     'humidity: ' + data.humidity.toFixed(2) + '%');

            setTimeout(readSensorData, 1000);
        }

        readSensorData();
    }
}

module.exports = DHT11HumiditySensor
