import winston from "winston"

class loggerObject{
    constructor (){
        this.loggerInfo = winston.createLogger({
            transports : [
                new winston.transports.Console({ level:'info' }),
            ]
         })
         this.loggerWarn = winston.createLogger({
            transports : [
                new winston.transports.Console({ level:'warn' }),
                new winston.transports.File({ filename: 'warn.log', level:'warn' }), 
            ]
         })
         this.loggerError = winston.createLogger({
            transports : [
                new winston.transports.Console({ level:'error' }),
                new winston.transports.File({ filename: 'error.log', level:'error' }), 
            ]
         })
    }

    info(mensaje){
        this.loggerInfo.info(mensaje)
    }
    warn(mensaje){
        this.loggerWarn.warn(mensaje)
    }
    error(mensaje){
        this.loggerError.error(mensaje)
    }
}

const logger = new loggerObject()

export default logger