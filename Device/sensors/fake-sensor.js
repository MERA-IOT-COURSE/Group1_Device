const Sensor = require('./sensor')

function getRandomInt(max) {
    return Math.floor(Math.random() * Math.floor(max));
}

class FakeSensor extends Sensor {
    constructor(updateIntervalMs) {
        super("sensor.fake", "Fake Sensor", updateIntervalMs)
    }

    readData() {
        const data = getRandomInt(100)
        return data
    }
}

module.exports = FakeSensor