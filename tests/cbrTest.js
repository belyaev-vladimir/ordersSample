process.env.NODE_ENV = 'test';
'use strict';
const
    chai = require('chai'),
    should = require('chai').should(),
    CbrController = require('../controllers/cbrController');


describe('cbr.ru', () => {
    it(`get daily info`, async() => {
        let curs = await CbrController.getCursOnCurrentDate();
        curs.should.be.an('array');
        (curs.length > 0).should.be.true;
        curs[0].should.have.property('VchCode');
        curs[0].should.have.property('Vcurs');
    });
});
