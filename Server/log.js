var winston = require('winston')

function getModulePath(module) {
    // Add filename in log statements
    return module.filename.split('/').slice(-2).join('/')
}

function getFormatter(module) {
    return winston.format.combine(
        winston.format.colorize({ 
            all: true 
        }),
        winston.format.splat(),
        winston.format.label({
            label:getModulePath(module)
        }),
        winston.format.timestamp({
            format:"YY-MM-DD HH:MM:SS"
        }),
        winston.format.printf(
            info => `[${info.label}] ${info.level}: ${info.message}`
        )
    );
}

function logger(module) {
    return winston.createLogger({
        format: getFormatter(module),
        transports: [
            new winston.transports.Console({
                level: 'debug',
                handleException: true,
            })
        ],
        exitOnError: false
    })
}

module.exports = logger