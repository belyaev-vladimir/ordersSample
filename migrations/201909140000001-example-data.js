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
                INSERT INTO 'orders'
                VALUES (1, 'abcdes', 'qwerty@ya.ru', '+7915', '100.00', 'USD', '2017-03-14 09:59:13'),
                       (2, 'qazwsx', 'qsc@ya.ru', '+375', '99.00', 'EUR', '2017-03-14 09:59:15'),
                       (3, 'qweras', 'sdfs@sd.ru', '+123', '85.00', 'EUR', '2017-03-14 09:59:19'),
                       (4, 'wsxcde', 'asdf@rf.ru', '+456', '1500.00', 'RUB', '2017-03-14 09:59:24'),
                       (5, 'wsxqaz', 'fgfg@ru.ru', '+789', '175.00', 'USD', '2017-03-14 09:59:32'),
                       (6, 'rewsdf', 'asdfa@ya.ru', '+987', '2500.00', 'RUB', '2017-03-14 09:59:29'),
                       (7, 'dsawsx', 'wsxasd@ya.ru', '+654', '25.00', 'EUR', '2017-03-14 09:59:34'),
                       (8, 'qazasd', 'wsxdse@ya.ru', '+321', '47.00', 'EUR', '2017-03-14 09:59:37'),
                       (9, 'wsxrfv', 'www@ya.ru', '+741', '74.00', 'USD', '2017-03-14 09:59:39'),
                       (10, 'cdevfr', 'ru@ya.ru', '+852', '95.00', 'RUB', '2017-03-14 09:59:41');

                INSERT INTO 'order_passengers' ('order_id', 'name_first', 'name_second')
                VALUES (1, 'Василий', 'Пупкин'),
                       (1, 'Василиса', 'Пупкина'),
                       (2, 'Петр', 'Иванов'),
                       (3, 'Иван', 'Петров'),
                       (4, 'Иван', 'Сидоров'),
                       (4, 'Петр', 'Сидоров'),
                       (4, 'Артем', 'Иванов'),
                       (5, 'Олег', 'Сидоров'),
                       (6, 'Ольга', 'Сидорова'),
                       (6, 'Анна', 'Сидорова'),
                       (7, 'Анна', 'Иванова'),
                       (8, 'Елена', 'Петрова'),
                       (8, 'Андрей', 'Петров'),
                       (8, 'Георгий', 'Петров'),
                       (9, 'Максим', 'Кузнецов'),
                       (10, 'Максим', 'Кузнецов');
        `
    );
};

exports.down = async(db) => {
    await db.runSql(`
        DELETE
        FROM 'orders'
        WHERE ID >= 1
          AND ID  <=10;

        DELETE
        FROM 'order_passengers'
        WHERE ID >= 1
          AND ID <=16;

    `);

};
