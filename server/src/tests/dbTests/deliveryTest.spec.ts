require('dotenv').config();
import 'source-map-support/register';
import { getDeliveryFromDb, putDeliveryInDb, deleteDeliveryInDb, getUsersDeliveries, saveDeliveriesToDb, getAllDeliveriesFromAllSubscribers } from '../../dbUtils';
import { expect } from 'chai';
import 'mocha';
import { Delivery } from '../../../../common/interfaces';

describe('Delivery tests', () => {
    it('Put, get and delete a delivery', async () => {
        let delivery1 = {
            vendorId: "testVendorId66",
            userId: "testUserId16",
            deliverytime: "2021-04-20",
            menuId: "1",
            cancelled: false,
            paid: "betalt",
            approved: true
        };
        let delivery2 = {
            vendorId: "testVendorId66",
            userId: "testUserId16",
            deliverytime: "2021-04-01",
            menuId: "1", 
            cancelled: true,
            paid: "betalt",
            approved: true
        };
        let delivery3 = {
            vendorId: "testVendorId66",
            userId: "testUserId26",
            deliverytime: "2021-05-01",
            menuId: "1", 
            cancelled: false,
            paid: "betalt",
            approved: true
        };
        let delivery4 = {
            vendorId: "testVendorId66",
            userId: "testUserId26",
            deliverytime: "2021-05-31",
            menuId: "1", 
            cancelled: false,
            paid: "betalt",
            approved: true
        }

        const putResult = await putDeliveryInDb("testVendorId66", "testUserId16", delivery1);
        expect(putResult.deliverytime).to.equal("2021-04-20");
        expect(putResult.menuId).to.equal("1");
        expect(putResult.cancelled).to.equal(false);

        const getResult = await getDeliveryFromDb("testVendorId66", "testUserId16", "2021-04-20");
        expect(getResult.deliverytime).to.equal("2021-04-20");
        expect(getResult.menuId).to.equal("1");
        expect(getResult.cancelled).to.equal(false);

        await putDeliveryInDb("testVendorId66", "testUserId16", delivery2);
        const getAllUserDel = await getUsersDeliveries("testUserId16", "2021-04-01", "2021-04-30");
        expect(getAllUserDel.length).to.equal(2);
        let res1 = getAllUserDel.find( ({deliverytime}) => deliverytime === "2021-04-01");
        expect(res1.cancelled).to.equal(true);
        expect(res1.deliverytime).to.equal("2021-04-01");
        expect(res1.menuId).to.equal("1");

        await putDeliveryInDb("testVendorId66", "testUserId26", delivery3);
        await putDeliveryInDb("testVendorId66", "testUserId26", delivery4);
 
        let getDelsForAllSubs = await getAllDeliveriesFromAllSubscribers("testVendorId66", "2021-04-01", "2021-05-31") as Delivery[];
        expect(getDelsForAllSubs.length).to.equal(4);
        let res2 = getDelsForAllSubs.find( ({deliverytime}) => deliverytime === "2021-05-31");
        expect(res2.menuId).to.equal("1");
        let res3 = getDelsForAllSubs.find( ({deliverytime}) => deliverytime === "2021-05-01");
        expect(res3.menuId).to.equal("1");
        let res4 = getDelsForAllSubs.find( ({deliverytime}) => deliverytime === "2021-04-20");
        expect(res4.menuId).to.equal("1");
        let res5 = getDelsForAllSubs.find( ({deliverytime}) => deliverytime === "2021-04-01");
        expect(res5.menuId).to.equal("1");

        await deleteDeliveryInDb("testUserId16", "2021-04-20");
        const testDelete1 = await getDeliveryFromDb("testVendorId66", "testUserId16", "2021-04-20");
        expect(testDelete1).to.equal(undefined);
        await deleteDeliveryInDb("testUserId16", "2021-04-01");
        const testDelete2 = await getDeliveryFromDb("testVendorId66", "testUserId16", "2021-04-01");
        expect(testDelete2).to.equal(undefined);

        let newDeliveries = [{
            vendorId: "testVendorId66",
            userId: "testUserId26",
            deliverytime: "2021-06-01", 
            menuId: "1", 
            cancelled: false,
            paid: "betalt",
            approved: true
        },
        {
            vendorId: "testVendorId66",
            userId: "testUserId26",
            deliverytime: "2021-06-15",
            menuId: "1", 
            cancelled: false,
            paid: "betalt",
            approved: true
        },
        {
            vendorId: "testVendorId66",
            userId: "testUserId26",
            deliverytime: "2021-06-30",
            menuId: "1", 
            cancelled: false,
            paid: "betalt",
            approved: true
        }]

        await saveDeliveriesToDb(newDeliveries);
        let postNewDels = await getUsersDeliveries("testUserId26", "2021-06-01", "2021-06-30");
        expect(postNewDels.length).to.equal(3);
        let firstDel = postNewDels.find( ({deliverytime}) => deliverytime === "2021-06-15");
        expect(firstDel.menuId).to.equal("1");
        expect(firstDel.cancelled).to.equal(false);
        expect(firstDel.userId).to.equal("testUserId26");

        await deleteDeliveryInDb("testUserId26", "2021-05-01");
        const newGet3 = await getDeliveryFromDb("testVendorId66", "testUserId26", "2021-05-01");
        expect(newGet3).to.equal(undefined);
        await deleteDeliveryInDb("testUserId26", "2021-05-31");
        const newGet4 = await getDeliveryFromDb("testVendorId66", "testUserId26", "2021-05-31");
        expect(newGet4).to.equal(undefined);

        await deleteDeliveryInDb( "testUserId26", "2021-06-01");
        await deleteDeliveryInDb("testUserId26", "2021-06-15");
        await deleteDeliveryInDb("testUserId26", "2021-06-30"); 
    });
});