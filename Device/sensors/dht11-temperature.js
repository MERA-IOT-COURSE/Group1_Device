const Sensor = require('./sensor')
const RpiDHTSensor = require('rpi-dht-sensor');

class DHT11TemperatureSensor extends Sensor {
    constructor(gpioPin) {
        super("temperature", "sensor.temperature")

        this.dht = new RpiDHTSensor.DHT11(gpioPin);
    }

    readData() {
        const data = sensor.dht.read()
        return data.temperature.toFixed(2)
    }
}

module.exports = DHT11TemperatureSensor