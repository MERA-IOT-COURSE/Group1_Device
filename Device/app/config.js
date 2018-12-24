const config = require('../../Common/config/config')

config.defaults({
    'ip': 'localhost',
    'port': '1883',
    'backendId': 'master'
});

module.exports = config