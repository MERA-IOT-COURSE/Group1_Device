const fs = require('fs')

const defaultValue = {
    "ip": "localhost",
    "port": "1883",
    "backendId": "master"
}

function load(configPath) {
    if (!fs.existsSync(configPath)) {
        return defaultValue
    }

    var config = fs.readFileSync(configPath, 'utf-8')
    var configObj = JSON.parse(config)
    
    var ip = configObj.ip ? configObj.ip : defaultValue.ip
    var port = configObj.port ? configObj.port : defaultValue.port 
    var backendId = configObj.backendId ? configObj.backendId : defaultValue.backendId
    
    obj = {
        "ip" : ip,
        "port" : port,
        "backendId" : backendId
    }
    
    return obj
}

module.exports.load = load