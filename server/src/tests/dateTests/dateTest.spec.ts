require('dotenv').config();
import 'source-map-support/register';
import { expect } from 'chai';
import 'mocha';
import { WeekTime } from '../../interfaces'
import { toWeekTime } from '../../timeHandling'

describe('Date and time tests', () => {
    it('From date to WeekTime',  () => {
        let result:WeekTime = toWeekTime(new Date("2021-12-17T03:24:05"));
        expect(result.day).equal(5);
        expect(result.time).equal(3 * 1000 * 3600 + 24 * 60 * 1000 + 5*1000);


    });
});