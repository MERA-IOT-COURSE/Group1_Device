const Sensor = require('./sensor')
const RpiDHTSensor = require('rpi-dht-sensor');

class DHT11HumiditySensor extends Sensor {
    constructor(gpioPin) {
        super("humidity", "sensor.humidity")

        this.dht = new RpiDHTSensor.DHT11(gpioPin);
    }

    readData() {
        const data = sensor.dht.read()
        return data.humidity.toFixed(2)
    }
}

module.exports = DHT11HumiditySensor
