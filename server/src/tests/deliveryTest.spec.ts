require('dotenv').config();
import 'source-map-support/register';
import { getDeliveryFromDb, putDeliveryInDb, deleteDeliveryInDb, getUsersDeliveries, postDeliveriesToDb, getAllDeliveriesFromAllSubscribers } from '../dbUtils';
import { expect } from 'chai';
import 'mocha';

describe('Delivery tests', () => {
    it('Put, get and delete a delivery', async () => {
        let delivery1 = {
            vendorId: "testVendorId66",
            userId: "testUserId16",
            deliverytime: "2021-04-20",
            menu: "lunch", 
            cancelled: false
        };
        let delivery2 = {
            vendorId: "testVendorId66",
            userId: "testUserId16",
            deliverytime: "2021-04-01",
            menu: "dinner", 
            cancelled: true
        };
        let delivery3 = {
            vendorId: "testVendorId66",
            userId: "testUserId26",
            deliverytime: "2021-05-01",
            menu: "lunch", 
            cancelled: false
        };
        let delivery4 = {
            vendorId: "testVendorId66",
            userId: "testUserId26",
            deliverytime: "2021-05-31",
            menu: "dinner", 
            cancelled: false
        };

        const putResult = await putDeliveryInDb("testVendorId66", "testUserId16", delivery1);
        expect(putResult.deliverytime).to.equal("2021-04-20");
        expect(putResult.menu).to.equal("lunch");
        expect(putResult.cancelled).to.equal(false);

        const getResult = await getDeliveryFromDb("testVendorId66", "testUserId16", "2021-04-20");
        expect(getResult.deliverytime).to.equal("2021-04-20");
        expect(getResult.menu).to.equal("lunch");
        expect(getResult.cancelled).to.equal(false);

        await putDeliveryInDb("testVendorId66", "testUserId16", delivery2);
        const getAllUserDel = await getUsersDeliveries("testVendorId66", "testUserId16", "2021-04-01", "2021-04-30");
        expect(getAllUserDel.length).to.equal(2);
        let res1 = getAllUserDel.find( ({deliverytime}) => deliverytime === "2021-04-01");
        expect(res1.cancelled).to.equal(true);
        expect(res1.deliverytime).to.equal("2021-04-01");
        expect(res1.menu).to.equal("dinner");

        await putDeliveryInDb("testVendorId66", "testUserId26", delivery3);
        await putDeliveryInDb("testVendorId66", "testUserId26", delivery4);

        let getDelsForAllSubs = await getAllDeliveriesFromAllSubscribers("testVendorId66", "2021-04-01", "2021-05-31");

        expect(getDelsForAllSubs.length).to.equal(4);
        let res2 = getDelsForAllSubs.find( ({deliverytime}) => deliverytime === "2021-05-31");
        expect(res2.menu).to.equal("dinner");
        let res3 = getDelsForAllSubs.find( ({deliverytime}) => deliverytime === "2021-05-01");
        expect(res3.menu).to.equal("lunch");
        let res4 = getDelsForAllSubs.find( ({deliverytime}) => deliverytime === "2021-04-20");
        expect(res4.menu).to.equal("lunch");
        let res5 = getDelsForAllSubs.find( ({deliverytime}) => deliverytime === "2021-04-01");
        expect(res5.menu).to.equal("dinner");

        await deleteDeliveryInDb("testVendorId66", "testUserId16", "2021-04-20");
        const testDelete1 = await getDeliveryFromDb("testVendorId66", "testUserId16", "2021-04-20");
        expect(testDelete1).to.equal(undefined);
        await deleteDeliveryInDb("testVendorId66", "testUserId16", "2021-04-01");
        const testDelete2 = await getDeliveryFromDb("testVendorId66", "testUserId16", "2021-04-01");
        expect(testDelete2).to.equal(undefined);

        let newDeliveries = [{
            vendorId: "testVendorId66",
            userId: "testUserId26",
            deliverytime: "2021-06-01",
            menu: "dinner", 
            cancelled: false
        },
        {
            vendorId: "testVendorId66",
            userId: "testUserId26",
            deliverytime: "2021-06-15",
            menu: "lunch", 
            cancelled: false        
        },
        {
            vendorId: "testVendorId66",
            userId: "testUserId26",
            deliverytime: "2021-06-30",
            menu: "lunch", 
            cancelled: false        
        }]

        await postDeliveriesToDb(newDeliveries);
        let postNewDels = await getUsersDeliveries("testVendorId66", "testUserId26", "2021-06-01", "2021-06-30");
        expect(postNewDels.length).to.equal(3);
        let firstDel = postNewDels.find( ({deliverytime}) => deliverytime === "2021-06-15");
        expect(firstDel.menu).to.equal("lunch");
        expect(firstDel.cancelled).to.equal(false);
        expect(firstDel.userId).to.equal("testUserId26");

        await deleteDeliveryInDb("testVendorId66", "testUserId26", "2021-05-01");
        const newGet3 = await getDeliveryFromDb("testVendorId66", "testUserId26", "2021-05-01");
        expect(newGet3).to.equal(undefined);
        await deleteDeliveryInDb("testVendorId66", "testUserId26", "2021-05-31");
        const newGet4 = await getDeliveryFromDb("testVendorId66", "testUserId26", "2021-05-31");
        expect(newGet4).to.equal(undefined);

        await deleteDeliveryInDb("testVendorId66", "testUserId26", "2021-06-01");
        await deleteDeliveryInDb("testVendorId66", "testUserId26", "2021-06-15");
        await deleteDeliveryInDb("testVendorId66", "testUserId26", "2021-06-30"); 
    }).timeout(5000);
});