process.env.NODE_ENV = 'test';
'use strict';
const
    chai = require('chai'),
    should = require('chai').should(),
    migrate = require('../db/migrate'),
    dbInit = require('../db').init,
    OrderController = require('../controllers/orderController');

describe('orders', () => {

    before(async() => {
        await migrate().up();
        await dbInit();
        await OrderController.updateActualOrderStates();
    });

    it(`get order list`, async() => {
        let orders = await OrderController.findOrders();
        // Тест срабатывает после инициализации БД, поэтому таблица не пустая
        orders.should.be.an('array');
        (orders.length > 0).should.be.true;

        orders.forEach((order) => {
            order.should.have.property('ID');
            order.should.have.property('locator');

            order.should.have.property('email');
            order.should.have.property('price');
            order.should.have.property('currency');
            order.should.have.property('date_insert');
        });
    });

    it(`get actual orders`, async() => {
        let actualOrders = await OrderController.findActualOrders();
        actualOrders.should.be.an('array');
        (actualOrders.length > 0).should.be.true;

        actualOrders.forEach((order) => {
            order.should.have.property('ID');
            order.should.have.property('locator');

            order.should.have.property('date_update');
            order.should.have.property('local_price');
            order.should.have.property('base_price');
            order.should.have.property('order_passengers');
        });
    });

    it(`check actual orders count`, async() => {
        //
        let actualOrders = await OrderController.findActualOrders();
        let orders = await OrderController.findOrders();

        //проверяю, что все заказы пересчитаны
        actualOrders.length.should.be.equal(orders.length);

    });

    it(`get order list`, async() => {
        let orders = await OrderController.findOrders();

        orders.should.be.an('array');
        (orders.length > 0).should.be.true;

        orders.forEach((order) => {
            order.should.have.property('ID');
            order.should.have.property('locator');

            order.should.have.property('email');
            order.should.have.property('price');
            order.should.have.property('currency');
            order.should.have.property('date_insert');
        });
    });

    it(`get actual order states`, async() => {
        let orders = await OrderController.getActualOrderStates();

        orders.should.be.an('array');

        orders.forEach((order) => {
            order.should.have.property('ID');
            order.should.have.property('locator');

            order.should.have.property('date_update');
            order.should.have.property('base_price');
            order.should.have.property('local_price');
            order.should.have.property('count_passengers');
        });
    });

    it(`update actual order states into temp`, async() => {
        let result = await OrderController.updateActualOrderStates();
        result.should.be.true;
    });
});
