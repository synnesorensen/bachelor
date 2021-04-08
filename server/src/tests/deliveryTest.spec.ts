require('dotenv').config();
import 'source-map-support/register';
import { getDeliveryFromDb, putDeliveryInDb, deleteDeliveryInDb, getUsersDeliveries } from '../dbUtils';
import { expect } from 'chai';
import 'mocha';

describe('Delivery tests', () => {
    it('Put, get and delete a delivery', async () => {
        let delivery = {
            deliverytime: "2021-04-20",
            menu: "lunch", 
            cancelled: false
        };

        const putResult = await putDeliveryInDb("testVendorId", "testUserId", delivery);
        console.log(putResult);
        expect(putResult.deliverytime).to.equal("2021-04-20");
        expect(putResult.menu).to.equal("lunch");
        expect(putResult.cancelled).to.equal(false);

        const getResult = await getDeliveryFromDb("testVendorId", "testUserId", "2021-04-20");
        console.log(getResult);
        expect(getResult.deliverytime).to.equal("2021-04-20");
        expect(getResult.menu).to.equal("lunch");
        expect(getResult.cancelled).to.equal(false);

        await deleteDeliveryInDb("testVendorId", "testUserId", "2021-04-20");
        const newGet = await getDeliveryFromDb("testVendorId", "testUserId", "2021-04-20");
        expect(newGet).to.equal(undefined);
    });
});