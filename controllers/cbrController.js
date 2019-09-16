'use strict';
const
    _ = require('lodash'),
    soap = require('soap-as-promised'),
    dateFormat = require('dateformat'),
    log = require('../log')(module),
    config = require('../config').get('cbr');

class CbrController {

    static async getCursOnCurrentDate() {
        try {
            //готовлю запрос к внешнему ресурсу
            let client = await soap.createClient(config['wsdl']);
            let res = await client[config['method']]({On_date: dateFormat(new Date(), 'yyyy-mm-dd')});

            //перодставляю результат в удобном виде
            return _.get(res,
                'GetCursOnDateXMLResult' +
                '.ValuteData' +
                '.ValuteCursOnDate',
                []);

        } catch (err) {
            log.error(err.toString());
            return [];
        }
    }
}

module.exports = CbrController;
