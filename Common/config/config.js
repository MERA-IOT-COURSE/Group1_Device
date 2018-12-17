var nconf = require('nconf');
 
nconf.env().argv();
nconf.file(nconf.get('config') || 'config.json');

module.exports = nconf