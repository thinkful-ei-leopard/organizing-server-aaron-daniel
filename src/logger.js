const winston = require('winston')
const { NODE_ENV} = require('./config')

const logger = winston.createLogger({
    level: 'info',
    format: winston.format.json(),
    transports: [
        new winston.transports.File({ filename: 'info.log' })
    ]
})

if (NODE_ENV !== 'production') {
    logger.addEventListener(new.winston.transports.Console({
        format: winston.format.simple()
    }))
}

module.exports = logger