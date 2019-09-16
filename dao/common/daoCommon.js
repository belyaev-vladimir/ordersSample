'use strict';

const
    source = require('../../db').source,
    log = require('../../log')(module),
    Promise = require('bluebird'),
    DaoError = require('./daoError');

/**
 * Общие методы для dao
 */
class Common {

    static stmtPrepare(sqlRequest) {
        return source.db.prepare(sqlRequest);
    }

    static stmtRun(stmt, sqlParams) {
        return new Promise((resolve, reject) => {
            stmt.run(sqlParams, (err) => {
                if (err) {
                    reject(DaoError.invalidArguments);
                } else {
                    resolve();
                }

            });
        });
    }

    static all(sqlRequest, sqlParams) {
        return new Promise((resolve, reject) => {
            let stmt = Common.stmtPrepare(sqlRequest);

            stmt.all(sqlParams, (err, rows) => {
                if (err) {
                    reject(DaoError.invalidArguments);
                } else if (rows === null || rows.length === 0) {
                    resolve([])
                } else {
                    resolve(rows);
                }
            });
        });
    }

    static async bulkinsert(sqlRequest, sqlParams) {
        try {
            let stmt = Common.stmtPrepare("begin transaction");

            await Common.stmtRun(stmt, {});

            for (let i = 0; i < sqlParams.length; i++) {

                stmt = Common.stmtPrepare(sqlRequest);
                await Common.stmtRun(stmt, sqlParams[i]);

                stmt.finalize();
            }

            stmt = Common.stmtPrepare("commit");

            await Common.stmtRun(stmt, {});

            return true;
        } catch (e) {
            log.error(e.toString());
            return false
        }
    }

}

module.exports = Common;
