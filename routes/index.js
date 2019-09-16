'use strict';

const
    router = require('express').Router(),
    log = require('../log')(module),
    OrderController = require('../controllers/orderController');

router.get('/orders', async(req, res) => {
    try {
        let data = await OrderController.findActualOrders();
        res.render('index.hbs', {
            orders: data
        });
    } catch (err) {
        log.error(err.toString());
    }
});

router.get('/order/*', async(req, res) => {
    try {
        let data = await OrderController.findPassengersList(req.params[0]);
        res.render('passengers.hbs', {
            passengers: data
        });
    } catch (err) {
        log.error(err.toString());
    }
});


module.exports = router;
