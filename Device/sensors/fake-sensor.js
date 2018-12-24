const Sensor = require('./sensor')
const Utils = require('../utils')

class FakeSensor extends Sensor {
    constructor(readIntervalMs) {
        super("fake", "sensor.fake")

        var sensor = this

        function getRandomInt(max) {
            return Math.floor(Math.random() * Math.floor(max));
        }

        function sendData() {
            const data = getRandomInt(100);
            sensor.emit("data", sensor, data, Utils.getTimestamp())
            setTimeout(sendData, readIntervalMs);
        }

        sendData();
    }
}

module.exports = FakeSensor