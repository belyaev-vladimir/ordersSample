'use strict';

// создает объект лога - этот модуль подключаем во всех остальных где нужен лог
const {createLogger, format, transports} = require('winston');
const {combine, timestamp, label, printf} = format;


const
    ENV = process.env.NODE_ENV,
    LOG_PATH = './serverLogs',
    LOG_FILE = 'server.log';

/**
 * функция возвращает объект лога, для его дальнейшего использования
 * @param module - имя логируемого модуля
 * @param pathToLogs - директория для хранения лога
 * @param file - имя файла лога
 * @returns {*}
 */
let getLogger = (module, pathToLogs = LOG_PATH, file = LOG_FILE) => {

    const path = module.filename.split('/').slice(-2).join('/');

    return createLogger({
        format: combine(
            timestamp(),

            //в качестве метки сообщения лога вывожу полный путь до модуля.
            label({label: path}),
            printf(info => JSON.stringify(info))
        ),

        transports: [

            //вывод в консоль
            new transports.Console({
                colorize: true,
                //  timestamp: tsFormat,
                //определяю уровень логирования
                level: ENV === 'debug'
            }),

            //вывод в лог
            new transports.File({
                filename: `${pathToLogs}/${file}`,
                level: 'debug',
            })
        ],
        exitOnError: false
    });
};

module.exports = getLogger;
