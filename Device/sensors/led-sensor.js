const Sensor = require('./sensor')
const Action = require('../app/action')

const Gpio = require('onoff').Gpio

class LedSensor extends Sensor {
    constructor(redPin, greenPin, bluePin) {
        super("led.rgb", "LED")
        this.red = new Gpio(redPin, 'out')
        this.green = new Gpio(greenPin, 'out')
        this.blue = new Gpio(bluePin, 'out')
        
        this.actions = [
            new Action("common.toggle_red", "Toggle red", () => {
                this.red.writeSync(this.red.readSync() ^ 1)
            }),
            new Action("common.toggle_green", "Toggle green", () => {
                this.green.writeSync(this.green.readSync() ^ 1)
            }),
            new Action("common.toggle_blue", "Toggle blue", () => {
                this.blue.writeSync(this.blue.readSync() ^ 1)
            })
        ]
    }
}

module.exports = LedSensor