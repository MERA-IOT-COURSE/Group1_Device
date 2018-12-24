class Action {
    constructor(id, name, action) {
        // Action must return two values: [err, data]
        // err contains a error string in case of incorrect behaviour, null otherwise
        // data - optional parameter with payload, can be null
        // if function returns nothing -> it always run successfully

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
        let result = this.action()
        if (result === undefined) {
            return [null, null]
        } 
        else {
            let [err, data] = result
            return [err, data]
        }
    }
}

module.exports = Action
