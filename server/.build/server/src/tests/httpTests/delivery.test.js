"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
require("source-map-support/register");
const api_1 = require("../../../../clients/webclient/src/api/api");
const settings_1 = require("../../../../common/settings");
const chai_1 = require("chai");
require("mocha");
const mocha_1 = require("mocha");
let vendor = null;
let user = null;
const vendormail = settings_1.testVend;
const usermail = settings_1.testUser;
describe('Delivery, user and vedorDeliveries http test', () => {
    mocha_1.beforeEach(async function () {
        vendor = new api_1.Api();
        user = new api_1.Api();
        await vendor.login(settings_1.testVend, settings_1.testVendPass);
        await user.login(settings_1.testUser, settings_1.testPass);
    });
    it('Put, get and delete a delivery', async () => {
        let delivery1 = {
            vendorId: vendormail,
            userId: usermail,
            deliverytime: "2021-04-20T00:10:00.000Z",
            menuId: "1",
            cancelled: false
        };
        let delivery2 = {
            vendorId: vendormail,
            userId: usermail,
            deliverytime: "2021-04-01T00:10:00.000Z",
            menuId: "2",
            cancelled: true
        };
        let delivery3 = {
            vendorId: vendormail,
            userId: usermail,
            deliverytime: "2021-05-01T00:10:00.000Z",
            menuId: "1",
            cancelled: false
        };
        let delivery4 = {
            vendorId: vendormail,
            userId: usermail,
            deliverytime: "2021-05-31T00:10:00.000Z",
            menuId: "2",
            cancelled: false
        };
        const putResult1 = await vendor.putDelivery(vendormail, usermail, delivery1);
        chai_1.expect(putResult1.vendorId).to.not.equal(usermail);
        chai_1.expect(putResult1.userId).to.not.equal(vendormail);
        chai_1.expect(putResult1.deliverytime).to.equal("2021-04-20T00:10:00.000Z");
        chai_1.expect(putResult1.menuId).to.equal("1");
        chai_1.expect(putResult1.cancelled).to.equal(false);
        const getResult1 = await vendor.getDelivery(vendormail, usermail, "2021-04-20T00:10:00.000Z");
        chai_1.expect(getResult1.vendorId).to.equal(vendormail);
        chai_1.expect(getResult1.userId).to.equal(usermail);
        chai_1.expect(getResult1.deliverytime.substr(0, 10)).to.equal("2021-04-20");
        chai_1.expect(getResult1.menuId).to.equal("1");
        chai_1.expect(getResult1.cancelled).to.equal(false);
        const putResult2 = await vendor.putDelivery(vendormail, usermail, delivery2);
        chai_1.expect(putResult2.menuId).to.equal("2");
        const putResult3 = await vendor.putDelivery(vendormail, usermail, delivery3);
        chai_1.expect(putResult3.userId).to.equal(usermail);
        const putResult4 = await vendor.putDelivery(vendormail, usermail, delivery4);
        chai_1.expect(putResult4.vendorId).to.equal(vendormail);
        chai_1.expect(putResult4.userId).to.equal(usermail);
        await vendor.deleteDelivery(vendormail, usermail, "2021-05-01T00:10:00.000Z");
        await vendor.getDelivery(vendormail, usermail, "2021-05-01T00:10:00.000Z");
        let putRes = await vendor.putDelivery(vendormail, usermail, delivery3);
        chai_1.expect(putRes.deliverytime.substr(0, 10)).to.equal("2021-05-01");
        let getRes = await user.getAllUsersDeliveries("2021-04-01", "2021-04-30");
        chai_1.expect(getRes.length).to.equal(2);
        chai_1.expect(getRes[0].deliverytime.substr(0, 10)).to.equal("2021-04-01");
        chai_1.expect(getRes[1].deliverytime.substr(0, 10)).to.equal("2021-04-20");
        let res1 = getRes.find(({ deliverytime }) => deliverytime === "2021-04-20T00:10:00.000Z");
        chai_1.expect(res1.menuId).to.equal("1");
        let res2 = getRes.find(({ deliverytime }) => deliverytime === "2021-04-01T00:10:00.000Z");
        chai_1.expect(res2.menuId).to.equal("2");
        let getRes2 = await user.getAllUsersDeliveries("2021-04-01T00:10:00.000Z", "2021-05-31T00:10:00.000Z");
        chai_1.expect(getRes2.length).to.equal(4);
        const vDelgetResult = await vendor.getAllVendorsDeliveries("2021-04-01", "2021-04-30");
        chai_1.expect(vDelgetResult.length).to.equal(2);
        let vres1 = vDelgetResult.find(({ deliverytime }) => deliverytime === "2021-04-01T00:10:00.000Z");
        chai_1.expect(vres1.menuId).to.equal("2");
        let vres2 = vDelgetResult.find(({ deliverytime }) => deliverytime === "2021-04-20T00:10:00.000Z");
        chai_1.expect(vres2.menuId).to.equal("1");
        let vdelputRes = await vendor.postNewDeliveries("2021-06-30T00:10:00.000Z", 3, usermail);
        chai_1.expect(vdelputRes.length).to.equal(3);
        chai_1.expect(vdelputRes[0].userId).to.equal(usermail);
        chai_1.expect(vdelputRes[0].vendorId).to.equal(vendormail);
        chai_1.expect(vdelputRes[0].deliverytime.substr(0, 10)).to.equal("2021-07-06");
        chai_1.expect(vdelputRes[1].deliverytime.substr(0, 10)).to.equal("2021-07-07");
        chai_1.expect(vdelputRes[2].deliverytime.substr(0, 10)).to.equal("2021-07-13");
        chai_1.expect(vdelputRes[0].menuId).to.equal("2");
        chai_1.expect(vdelputRes[1].menuId).to.equal("3");
        chai_1.expect(vdelputRes[2].menuId).to.equal("2");
    });
    mocha_1.afterEach(async function () {
        await vendor.logout();
        await user.logout();
    });
});
//# sourceMappingURL=delivery.test.js.map