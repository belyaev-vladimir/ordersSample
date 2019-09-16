'use strict';

const
    DBMigrate = require('db-migrate'),
    configDB = require('../config').get('db');

let migrate = () => {

    let env = process.env.NODE_ENV || 'dev';

    let optionsMigrate = {
        env: env,
        config: configDB
    };

    return DBMigrate.getInstance(true, optionsMigrate);
};

module.exports = migrate;
