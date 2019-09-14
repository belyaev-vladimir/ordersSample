'use strict';

const
    DBMigrate = require('db-migrate'),
    configDB = require('../config').get('db');

let migrate = (env) => {

    let optionsMigrate = {
        env: env,
        config: configDB
    };

    return DBMigrate.getInstance(true, optionsMigrate);
};

module.exports = migrate;
