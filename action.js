class Action {
    constructor(id, name, action) {
        this.id = id
        this.name = name
        this.action = action
    }

    getId() {
        return this.id
    }

    getName() {
        return this.name
    }

    run() {
        this.action()
    }
}

module.exports = Action
