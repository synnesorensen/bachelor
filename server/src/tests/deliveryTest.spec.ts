require('dotenv').config();
import 'source-map-support/register';
import { getDeliveryFromDb, putDeliveryInDb, deleteDeliveryInDb, getUsersDeliveries, postDeliveriesToDb, getAllDeliveriesFromAllSubscribers } from '../dbUtils';
import { expect } from 'chai';
import 'mocha';

describe('Delivery tests', () => {
    it('Put, get and delete a delivery', async () => {
        let delivery1 = {
            deliverytime: "2021-04-20",
            menu: "lunch", 
            cancelled: false
        };
        let delivery2 = {
            deliverytime: "2021-04-01",
            menu: "dinner", 
            cancelled: true
        };

        const putResult = await putDeliveryInDb("testVendorId", "testUserId", delivery1);
        expect(putResult.deliverytime).to.equal("2021-04-20");
        expect(putResult.menu).to.equal("lunch");
        expect(putResult.cancelled).to.equal(false);

        const getResult = await getDeliveryFromDb("testVendorId", "testUserId", "2021-04-20");
        expect(getResult.deliverytime).to.equal("2021-04-20");
        expect(getResult.menu).to.equal("lunch");
        expect(getResult.cancelled).to.equal(false);

        await putDeliveryInDb("testVendorId", "testUserId", delivery2);
        const getAllDel = await getUsersDeliveries("testVendorId", "testUserId", "2021-04-01", "2021-04-30");
        expect(getAllDel.length).to.equal(2);
        let res = getAllDel.find( ({deliverytime}) => deliverytime === "2021-04-01");
        expect(res.cancelled).to.equal(true);
        expect(res.deliverytime).to.equal("2021-04-01");
        expect(res.menu).to.equal("dinner");

        await deleteDeliveryInDb("testVendorId", "testUserId", "2021-04-20");
        const newGet = await getDeliveryFromDb("testVendorId", "testUserId", "2021-04-20");
        expect(newGet).to.equal(undefined);
    });
});