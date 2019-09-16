'use strict';

const
    Http = require('http'),
    Express = require('express'),
    BodyParser = require('body-parser'),
    Cors = require('cors'),
    routes = require('./routes'),
    log = require('./log')(module),
    OrderController = require('./controllers/orderController'),
    exphbs = require('express-handlebars'),
    migrate = require('./db/migrate'),
    conf = require('./config'),
    db = require('./db');

const app = new Express(),
    server = Http.createServer(app);

app.use(Cors());
app.use(BodyParser.json());
app.use(BodyParser.urlencoded({
    extended: true
}));

app.engine('.hbs', exphbs({defaultLayout: 'layout', extname: '.hbs'}));
app.set('view engine', '.hbs');

//возвращаю что favicon нет
app.get('/favicon.ico', (req, res) => res.status(204));

// подключаю роуты
app.use(routes);

// обработчик 404
app.use((req, res) => {
    res.render('404.hbs');
});

// обработчик other internal erros
app.use((err, req, res) => {
    log.error(err.toString());
    res.status(500).send('Something broke!');
});

// подготвока к старту сервера
(async() => {
    try {
        // запускаю миграции
        await migrate().up();

        // инициализирую БД
        await db.init();

        //обновляю состояния заказов перед запуском системы
        await OrderController.updateActualOrderStates();

        //запускаю обновление заказов по таймеру
        setInterval(() => {
            OrderController.updateActualOrderStates();
        }, conf.get('timeUpdateOrderState'));

        // стартую сервер
        server.listen(conf.get('port'), () => {
            log.info(`App running on ${conf.get('port')}`);
        });

    } catch (e) {
        // если что-то при инициализации пошло не так, завершаю работу с сообщением в лог
        log.error(e.toString());
    }
})();

module.exports = server;
