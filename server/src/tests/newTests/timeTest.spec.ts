require('dotenv').config();
import 'source-map-support/register';
import { expect } from 'chai';
import 'mocha';
import { TestEnvironment } from '../../TestEnvironment';
import { findNextWorkDay, isVendorAbsent, toWeekTime, nextDeliveryDate } from '../../timeHandling';

const tenv = new TestEnvironment();
tenv.addAbsenceDate(new Date("2022-05-17"));
tenv.addAbsenceDate(new Date("2022-05-18"));

const weekTimes = [
  toWeekTime(new Date('2022-05-16T01:00:00.000Z')),
  toWeekTime(new Date('2022-05-17T02:00:00.000Z')),
  toWeekTime(new Date('2022-05-17T13:00:00.000Z')), 
  toWeekTime(new Date('2022-05-20T08:00:00.000Z'))
]; 

describe('Absent test', () => {
  it('checks if vendor is absent', async () => { 
    expect(await isVendorAbsent(new Date("2022-04-30"), tenv)).equal(false);
    expect(await isVendorAbsent(new Date("2022-05-17"), tenv)).equal(true);
  });
});

describe('Work day test', () => {
  it('checks when vendor is working', async () => { 
    expect((await findNextWorkDay(new Date("2022-04-20"), tenv)).getTime()).equal(new Date("2022-04-21").getTime());
    expect((await findNextWorkDay(new Date("2022-05-16"), tenv)).getTime()).equal(new Date("2022-05-19").getTime());
  });
});

describe('Next delivery day test', () => {
  it('finds the next delivery date', async () => {
    const nextDelivery = await nextDeliveryDate(new Date('2022-05-15'), weekTimes, tenv);
    expect((nextDelivery.date).getTime()).equal(new Date('2022-05-16').getTime());
  })
  it('finds the next delivery date', async () => {
    const nextDelivery = await nextDeliveryDate(new Date('2022-05-16'), weekTimes, tenv);
    expect((nextDelivery.date).getTime()).equal(new Date('2022-05-20').getTime());
  })
})

