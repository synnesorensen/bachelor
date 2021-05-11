"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
require("source-map-support/register");
const dbUtils_1 = require("../../dbUtils");
const chai_1 = require("chai");
require("mocha");
describe('Delivery tests', () => {
    it('Put, get and delete a delivery', async () => {
        let delivery1 = {
            vendorId: "testVendorId66",
            userId: "testUserId16",
            deliverytime: "2021-04-20",
            menuId: "1",
            cancelled: false
        };
        let delivery2 = {
            vendorId: "testVendorId66",
            userId: "testUserId16",
            deliverytime: "2021-04-01",
            menuId: "1",
            cancelled: true
        };
        let delivery3 = {
            vendorId: "testVendorId66",
            userId: "testUserId26",
            deliverytime: "2021-05-01",
            menuId: "1",
            cancelled: false
        };
        let delivery4 = {
            vendorId: "testVendorId66",
            userId: "testUserId26",
            deliverytime: "2021-05-31",
            menuId: "1",
            cancelled: false
        };
        const putResult = await dbUtils_1.putDeliveryInDb("testVendorId66", "testUserId16", delivery1);
        chai_1.expect(putResult.deliverytime).to.equal("2021-04-20");
        chai_1.expect(putResult.menuId).to.equal("1");
        chai_1.expect(putResult.cancelled).to.equal(false);
        const getResult = await dbUtils_1.getDeliveryFromDb("testVendorId66", "testUserId16", "2021-04-20");
        chai_1.expect(getResult.deliverytime).to.equal("2021-04-20");
        chai_1.expect(getResult.menuId).to.equal("1");
        chai_1.expect(getResult.cancelled).to.equal(false);
        await dbUtils_1.putDeliveryInDb("testVendorId66", "testUserId16", delivery2);
        const getAllUserDel = await dbUtils_1.getUsersDeliveries("testUserId16", "2021-04-01", "2021-04-30");
        chai_1.expect(getAllUserDel.length).to.equal(2);
        let res1 = getAllUserDel.find(({ deliverytime }) => deliverytime === "2021-04-01");
        chai_1.expect(res1.cancelled).to.equal(true);
        chai_1.expect(res1.deliverytime).to.equal("2021-04-01");
        chai_1.expect(res1.menuId).to.equal("1");
        await dbUtils_1.putDeliveryInDb("testVendorId66", "testUserId26", delivery3);
        await dbUtils_1.putDeliveryInDb("testVendorId66", "testUserId26", delivery4);
        let getDelsForAllSubs = await dbUtils_1.getAllDeliveriesFromAllSubscribers("testVendorId66", "2021-04-01", "2021-05-31");
        chai_1.expect(getDelsForAllSubs.length).to.equal(4);
        let res2 = getDelsForAllSubs.find(({ deliverytime }) => deliverytime === "2021-05-31");
        chai_1.expect(res2.menuId).to.equal("1");
        let res3 = getDelsForAllSubs.find(({ deliverytime }) => deliverytime === "2021-05-01");
        chai_1.expect(res3.menuId).to.equal("1");
        let res4 = getDelsForAllSubs.find(({ deliverytime }) => deliverytime === "2021-04-20");
        chai_1.expect(res4.menuId).to.equal("1");
        let res5 = getDelsForAllSubs.find(({ deliverytime }) => deliverytime === "2021-04-01");
        chai_1.expect(res5.menuId).to.equal("1");
        await dbUtils_1.deleteDeliveryInDb("testVendorId66", "testUserId16", "2021-04-20");
        const testDelete1 = await dbUtils_1.getDeliveryFromDb("testVendorId66", "testUserId16", "2021-04-20");
        chai_1.expect(testDelete1).to.equal(undefined);
        await dbUtils_1.deleteDeliveryInDb("testVendorId66", "testUserId16", "2021-04-01");
        const testDelete2 = await dbUtils_1.getDeliveryFromDb("testVendorId66", "testUserId16", "2021-04-01");
        chai_1.expect(testDelete2).to.equal(undefined);
        let newDeliveries = [{
                vendorId: "testVendorId66",
                userId: "testUserId26",
                deliverytime: "2021-06-01",
                menuId: "1",
                cancelled: false
            },
            {
                vendorId: "testVendorId66",
                userId: "testUserId26",
                deliverytime: "2021-06-15",
                menuId: "1",
                cancelled: false
            },
            {
                vendorId: "testVendorId66",
                userId: "testUserId26",
                deliverytime: "2021-06-30",
                menuId: "1",
                cancelled: false
            }];
        await dbUtils_1.saveDeliveriesToDb(newDeliveries);
        let postNewDels = await dbUtils_1.getUsersDeliveries("testUserId26", "2021-06-01", "2021-06-30");
        chai_1.expect(postNewDels.length).to.equal(3);
        let firstDel = postNewDels.find(({ deliverytime }) => deliverytime === "2021-06-15");
        chai_1.expect(firstDel.menuId).to.equal("1");
        chai_1.expect(firstDel.cancelled).to.equal(false);
        chai_1.expect(firstDel.userId).to.equal("testUserId26");
        await dbUtils_1.deleteDeliveryInDb("testVendorId66", "testUserId26", "2021-05-01");
        const newGet3 = await dbUtils_1.getDeliveryFromDb("testVendorId66", "testUserId26", "2021-05-01");
        chai_1.expect(newGet3).to.equal(undefined);
        await dbUtils_1.deleteDeliveryInDb("testVendorId66", "testUserId26", "2021-05-31");
        const newGet4 = await dbUtils_1.getDeliveryFromDb("testVendorId66", "testUserId26", "2021-05-31");
        chai_1.expect(newGet4).to.equal(undefined);
        await dbUtils_1.deleteDeliveryInDb("testVendorId66", "testUserId26", "2021-06-01");
        await dbUtils_1.deleteDeliveryInDb("testVendorId66", "testUserId26", "2021-06-15");
        await dbUtils_1.deleteDeliveryInDb("testVendorId66", "testUserId26", "2021-06-30");
    });
});
//# sourceMappingURL=deliveryTest.spec.js.map