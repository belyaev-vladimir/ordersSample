'use strict';

const
    OrderDao = require('../dao/orderDao'),
    Promise = require('bluebird'),
    money = require('money-math'),
    log = require('../log')(module),
    localVchCode = require('../config').get('VchCode'),
    CbrController = require('../controllers/cbrController');

class OrderController {

    static async findOrders() {
        return await OrderDao.findOrders();
    }

    static async findActualOrders() {
        return await OrderDao.findActualOrders();
    }

    static async findPassengersList(locator) {
        return await OrderDao.getPassengersList(locator);
    }

    //подготвка курсов валют к пересчету
    static async prepareCurs(curs) {
        return await Promise.all(
            curs.map(async(c) => {
                let val = {};
                val.code = c.VchCode;
                if (c.Vnom !== '1') {
                    val.curs = await money.div(
                        money.floatToAmount(c.Vcurs),
                        money.floatToAmount(c.Vnom)
                    );
                } else {
                    val.curs = money.floatToAmount(c.Vcurs);
                }

                return val;
            }));
    }

    // считаем актуальное состояние заказов
    static async prepareActualOrders(orders, curs) {
        return await
            Promise.all(
                orders.map(async(order) => {
                    let actualOrder = {};

                    actualOrder.ID = order.ID;
                    actualOrder.locator = `/order/${order.locator}`;
                    actualOrder.date_update = (new Date()).toLocaleDateString();

                    order.price = money.floatToAmount(order.price);

                    //если заказ в базовой валюте, ничего считать не надо
                    if (order.currency === localVchCode) {
                        actualOrder.local_price = order.price + ' ' + localVchCode;
                        actualOrder.base_price = actualOrder.local_price;
                    } else {
                        //иначе пересчитываю прайс
                        let rate = curs.filter((val) => {
                            return val.code === order.currency;
                        });

                        actualOrder.base_price = order.price + ' ' + order.currency;
                        actualOrder.local_price = money.mul(order.price, money.floatToAmount(rate[0].curs));
                        actualOrder.local_price += ' ' + localVchCode;
                    }

                    actualOrder.count_passengers = order.count_passengers;

                    return actualOrder;
                }));
    }

    //получаем актуальное состояние заказов
    static async getActualOrderStates() {

        // получаем список заказов
        let orders = await OrderDao.findOrdersWithPassengersCount();

        // получаем актуальные курсы валют
        let curs = await CbrController.getCursOnCurrentDate();

        // актуализирую курсы валют
        if (curs.length > 0) {
            curs = await OrderController.prepareCurs(curs);

            // получаю актуальные заказы
            return await OrderController.prepareActualOrders(orders, curs);
        }

        log.warn('Не удалось получить курсы валют');
        return [];
    }

    //сохраняю актуальное состояние заказов
    static async saveActualOrderStates(orders) {
        return await OrderDao.saveTempOrders(orders);
    }

    //обновляю актуальные состояние заказов
    static async updateActualOrderStates() {
        let orders = await OrderController.getActualOrderStates();

        if (orders.length > 0) {
            let updateResult = await OrderController.saveActualOrderStates(orders);
            let clearResult = await OrderDao.clearTempOrders(orders);

            log.info('статусы заказов обновленны');

            return updateResult && clearResult;
        }

        log.warn('Не удалось обновить статусы заказов');

        return false;
    }
}

module.exports = OrderController;
