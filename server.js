'use strict';

const
    Http = require('http'),
    Express = require('express'),
    BodyParser = require('body-parser'),
    Cors = require('cors'),
    log = require('./log')(module),
    migrate = require('./dbInit'),
    conf = require('./config');

const app = new Express(),
    server = Http.createServer(app);

app.use(Cors());
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({
    extended: true
}));

//возвращаю что favicon нет
app.get('/favicon.ico', (req, res) => res.status(204));

//руотинг
app.use('/orders', UsersController);
app.use('/order', UsersController);

//перед запуском сервера, инициализирую БД
(async() => {
    try {
        await migrate('dev').up();

        // стартую сервер
        server.listen(conf.get('port'), () => {
            log.info(`App running on ${conf.get('port')}`);
        });

    } catch (e) {
        // если бд не инициализирована, завершаю работу с сообщением в лог
        log.error(e.toString());
    }
})();

module.exports = server;
