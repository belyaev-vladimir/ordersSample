'use strict';

const path = require('path');

class Config {

    constructor() {
        this.nconf = require('nconf');

        //переменные окружения, которые перекрывают конфиг по умолчанию (для удобства использования в CI\CD):
        this.nconf.env();

        // конфиг по умолчанию
        this.nconf.file('defaults', path.join(__dirname, 'config.json'));
    }

    get(key) {
        return this.nconf.get(key);
    }

    set(key, value) {
        this.nconf.set(key, value);
    }
}

module.exports = new Config();
