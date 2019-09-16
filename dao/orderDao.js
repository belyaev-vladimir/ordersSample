'use strict';

const
    log = require('../log')(module),
    DaoCommon = require('./common/daoCommon');

class OrderDao extends DaoCommon {

    static async findOrders() {
        return await OrderDao.all(
            'select * from orders'
        );
    }

    static async findActualOrders() {

        return await OrderDao.all(
            'select * from tmp_orders_state'
        );
    }

    static async getPassengersList(locator) {

        let sqlParams = {$locator: locator};
        return await OrderDao.all(
            `select o.id,
                    o.locator,
                    o.price,
                    o.currency,
                    op.name_second,
                    op.name_first
                 from orders o
                 join order_passengers op
                 where o.id = op.order_id and locator = $locator `,
            sqlParams
        );
    }

    static async findOrdersWithPassengersCount() {
        return await OrderDao.all(
            `select o.id,
                    o.locator,
                    o.price,
                    o.currency,
                 COUNT(op.ID) as count_passengers
                 from orders o
                 join order_passengers op
                 where o.id = op.order_id
                 group by o.locator`
        );
    }

    static async saveTempOrders(actualOrders) {

        let sqlParams = await Promise.all(
            actualOrders.map(async (actualOrder) => {
                return {
                    $ID: actualOrder.ID,
                    $locator: actualOrder.locator,
                    $local_price: actualOrder.local_price,
                    $base_price: actualOrder.base_price,
                    $order_passengers: actualOrder.count_passengers
                };
            }));

        return await OrderDao.bulkinsert(`insert or replace into tmp_orders_state
             values 
              ($ID, $locator, DATE('now'), $local_price, $base_price, $order_passengers )`,
            sqlParams);

    }

    static async clearTempOrders() {

        let stmt = OrderDao.stmtPrepare(
            `delete from tmp_orders_state as t
             where  t.ID not in (select ID from orders)`);

        try {
            await OrderDao.stmtRun(stmt, {});

            return true;
        } catch (err) {
            log.error(err.toString());
            return false
        }

    }


}

module.exports = OrderDao;
