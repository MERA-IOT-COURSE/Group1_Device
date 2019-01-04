const Sensor = require('./sensor')
const RpiDHTSensor = require('rpi-dht-sensor');

class DHT11HumiditySensor extends Sensor {
    constructor(gpioPin) {
        super("sensor.humidity", "Humidity")

        this.dht = new RpiDHTSensor.DHT11(gpioPin);
        this.runAction("common.update_on")
    }

    readData() {
        const data = this.dht.read()
        return data.humidity.toFixed(2)
    }
}

module.exports = DHT11HumiditySensor
