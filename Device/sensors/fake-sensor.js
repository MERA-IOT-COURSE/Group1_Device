const Sensor = require('./sensor')

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

class FakeSensor extends Sensor {
    constructor(updateIntervalMs) {
        super("fake", "sensor.fake", updateIntervalMs)
    }

    readData() {
        const data = getRandomInt(100)
        return data
    }
}

module.exports = FakeSensor