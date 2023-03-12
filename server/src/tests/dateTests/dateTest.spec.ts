require('dotenv').config();
import 'source-map-support/register';
import { expect } from 'chai';
import 'mocha';
import { WeekTime } from '../../../../common/interfaces';
import { nextDeliveryDateQuick, toWeekTime, noOfDeliveriesInMonth, getDeliveryDatesQuick } from '../../timeHandling'
import { TestEnvironment } from '../../TestEnvironment';

const testenv = new TestEnvironment();

describe('Date and time tests', () => {
  it('From date to WeekTime', () => {
    let result: WeekTime = toWeekTime(new Date("2023-03-01T03:24:05.000Z"));
    expect(result.day).equal(3);
  });
  it('Find next weekTimes', async () => {
    let schedule: WeekTime[] = [{
      menuId: "2",
      day: 2,
      time: 1000
    },
    {
      menuId: "3",
      day: 3,
      time: 1000
    },
    {
      menuId: "41",
      day: 4,
      time: 1000
    }
    ];
    let result = await nextDeliveryDateQuick(new Date("2023-03-01T03:24:05.000Z"), schedule, []);
    console.log(result)
    expect(result.menuId).equal("3");
    expect(result.date.getUTCDay()).equal(3);
    expect(result.date.getUTCDate()).equal(1);
    expect(result.date.getUTCMonth()).equal(2);
    expect(result.date.getUTCFullYear()).equal(2023);

    let wrap = await nextDeliveryDateQuick(new Date("2023-03-03T03:24:05.000Z"), schedule, []);
    expect(wrap.menuId).equal("2");
    expect(wrap.date.getUTCDay()).equal(2);
    expect(wrap.date.getUTCDate()).equal(7);
    expect(wrap.date.getUTCMonth()).equal(2);
    expect(wrap.date.getUTCFullYear()).equal(2023);
  });
  it('Find next weekTimes', async () => {
    let schedule: WeekTime[] = [{
      menuId: "2",
      day: 2,
      time: 1000
    }];
    let result = await nextDeliveryDateQuick(new Date("2023-03-27T03:24:05.000Z"), schedule, []);
    expect(result.menuId).equal("2");
    expect(result.date.getDay()).equal(2);
    expect(result.date.getDate()).equal(28);
    expect(result.date.getMonth()).equal(2);
    expect(result.date.getUTCFullYear()).equal(2023);

    let wrap = await nextDeliveryDateQuick(new Date("2023-03-20T03:24:05.000Z"), schedule, []);
    expect(result.menuId).equal("2")
    expect(wrap.date.getDay()).equal(2);
    expect(wrap.date.getDate()).equal(21);
    expect(wrap.date.getMonth()).equal(2);
    expect(wrap.date.getUTCFullYear()).equal(2023);
  });
  it('Count deliveries in a month', async () => {
    let schedule: WeekTime[] = [
      {
        day: 3,
        time: 1000 * 3600 * 6
      },
      {
        day: 4,
        time: 1000 * 3600 * 6
      }];
    let result = await noOfDeliveriesInMonth(new Date("2023-03-01T00:00:01.000Z"), schedule, testenv);
    expect(result).equal(10);
  });

  it('Find next delivery dates', async () => {
    let schedule: WeekTime[] = [{
      menuId: "2",
      day: 2,
      time: 1000
    },
    {
      menuId: "3",
      day: 3,
      time: 1000
    },
    {
      menuId: "41",
      day: 4,
      time: 1000
    }
    ];
    let result = await getDeliveryDatesQuick(new Date("2023-03-01T00:00:05.000Z"), new Date("2023-03-31T00:00:05.000Z"), schedule);
    expect(result.length).equal(14);
    expect(result[0].date.getDate()).equal(1);
    expect(result[1].date.getDate()).equal(2);
    expect(result[2].date.getDate()).equal(7);
    expect(result[3].date.getDate()).equal(8);
    expect(result[4].date.getDate()).equal(9);
    expect(result[5].date.getDate()).equal(14);
    expect(result[6].date.getDate()).equal(15);
    expect(result[7].date.getDate()).equal(16);
    expect(result[0].menuId).equal("3");

    let result2 = await getDeliveryDatesQuick(new Date("2023-03-01T00:00:05.000Z"), new Date("2023-03-31T00:00:05.000Z"), schedule);
    expect(result2[0].date.getDay()).equal(3);

    let result3 = await getDeliveryDatesQuick(new Date("2023-03-10T00:00:05.000Z"), new Date("2023-03-31T00:00:05.000Z"), schedule);
    console.log(result3)
    expect(result3[0].date.getDay()).equal(2);
  });
});

