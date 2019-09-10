'use strict';

const
    Http = require('http'),
    Express = require('express'),
    BodyParser = require('body-parser'),
    Cors = require('cors'),
    log = require('./log')(module),
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

server.listen(conf.get('port'), () => {
    log.info(`App running on ${conf.get('port')}`);
});

module.exports = server;
