'use strict';

const
nconf = require('nconf'), 
path = require('path');

class Config {

    constructor() {
        //переменные окружения, которые перекрывают конфиг по умолчанию:
        nconf.env();

        if (nconf.get('OVERRIDES_CONFIG')) {
            let conf = nconf.get('OVERRIDES_CONFIG');

            conf = typeof conf === 'string' ? JSON.parse(conf) : conf;

            if (conf) {
                nconf.overrides(conf);
            }
        }

        //кастомный локальный файл конфига, который перекроет конфиг по умолчанию, но не переменные окружения
        if (nconf.get('OVERRIDES_CONFIG_FILE')) {
            nconf.file('overrides', path.join(__dirname, nconf.get('OVERRIDES_CONFIG_FILE')));
        }

        // конфиг по умолчанию
        nconf.file('defaults', path.join(__dirname, 'config.json'));
    }

    get(key) {
        return this.nconf.get(key);
    }

    set(key, value) {
        this.nconf.set(key, value);
    }
}

module.exports = new Config();
