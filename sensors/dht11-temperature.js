const Sensor = require('./sensor')
const RpiDHTSensor = require('rpi-dht-sensor');

class DHT11TemperatureSensor extends Sensor {
    constructor() {
        super("temperature", "sensor.temperature")

        this.dht = new RpiDHTSensor.DHT11(4);

        var sensor = this
        function readSensorData() {
            var data = sensor.dht.read();
            sensor.emit("data", sensor, data.temperature.toFixed(2), 0)
            setTimeout(readSensorData, 1000);
        }

        readSensorData();
    }
}

module.exports = DHT11TemperatureSensor