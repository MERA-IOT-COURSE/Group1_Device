// {
//     "id": <Unique id of action>,
//     "name": <Human readable name of action>
// }

const mongoose = require('mongoose')

const actionSchema = mongoose.Schema({
    id: String,
    name: String
})

module.exports = mongoose.model('Action', actionSchema)
module.exports.schema = actionSchema