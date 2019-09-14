'use strict';

let dbm, type, seed;


exports.setup = (options, seedLink) => {
    dbm = options.dbmigrate;
    type = dbm.dataType;
    seed = seedLink;
};

exports.up = async(db) => {
    return db.runSql(
            `

                CREATE TABLE orders
                (
                    'ID'          INTEGER PRIMARY KEY AUTOINCREMENT,
                    'locator'     NCHAR(55)     NOT NULL,
                    'email'       NCHAR(64)     NOT NULL,
                    'phone'       NCHAR(32)     NOT NULL,
                    'price'       DECIMAL(6, 2) NOT NULL,
                    'currency'    NCHAR(3)      NOT NULL,
                    'date_insert' TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
                );

                CREATE TABLE order_passengers
                (
                    'ID'          INTEGER PRIMARY KEY AUTOINCREMENT,
                    'order_id'    INTEGER   NOT NULL,
                    'name_first'  NCHAR(64) NOT NULL,
                    'name_second' NCHAR(64) NOT NULL,
                    'date_insert' TIMESTAMP DEFAULT CURRENT_TIMESTAMP NOT NULL
                );`
    );
};

exports.down = async(db) => {
    await db.dropTable('orders', {ifExists: true});
    await db.dropTable('order_passengers', {ifExists: true});
};
