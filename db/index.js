'use strict';

const
    sqlite3 = require('sqlite3').verbose(),
    path = require('path'),
    log = require('../log')(module),
    config = require('../config').get('db');

let _source = {},
    _semaphore = false;

let _newDbConnect = (path) => {
    // промисификация - для того чтобы использовать конструктор БД в стиле async/await
    return new Promise((resolve) => {
        _source.db = new sqlite3.Database(path,
            (err) => {
                if (err) reject("Open error: " + err.message);
                else resolve(path + " opened")
            }
        )
    })
};

/*
 инициализирует коннект к БД
 переменная окружения NODE_ENV определяет настройки коннекта
 */
let init = async () => {
    try {

        let env = process.env.NODE_ENV || 'dev';

        if (!_semaphore) {

            // mark awaited
            _semaphore = true;

            let dbName = path.resolve(process.cwd(), config[env].filename);

            await _newDbConnect(dbName);
        }

        return true;
    } catch (err) {
        log.error(err.toString());
        return false;
    }
};

module.exports = {
    init: init,
    source: _source
};
