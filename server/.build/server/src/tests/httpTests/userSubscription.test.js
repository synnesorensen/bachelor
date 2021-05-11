"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
require("source-map-support/register");
const api_1 = require("../../../../clients/webclient/src/api/api");
const chai_1 = require("chai");
const settings_1 = require("../../../../common/settings");
require("mocha");
const mocha_1 = require("mocha");
let vendor = null;
let user = null;
const vendormail = settings_1.testVend;
const usermail = settings_1.testUser;
describe('Users subscriptions http test', () => {
    mocha_1.beforeEach(async function () {
        vendor = new api_1.Api();
        user = new api_1.Api();
        await vendor.login(settings_1.testVend, settings_1.testVendPass);
        await user.login(settings_1.testUser, settings_1.testPass);
    });
    it('Putting, getting and deleting a subscription', async () => {
        const sub1 = {
            vendorId: vendormail,
            userId: usermail,
            approved: false,
            paused: true,
            schedule: ["2", "3"],
            noOfMeals: 1,
            box: "engangsboks"
        };
        const putSub = await vendor.putVendorSubscription(sub1);
        chai_1.expect(putSub.vendorId).to.equal(vendormail);
        chai_1.expect(putSub.userId).to.equal(usermail);
        chai_1.expect(putSub.approved).to.equal(false);
        chai_1.expect(putSub.paused).to.equal(true);
        chai_1.expect(putSub.schedule.length).to.equal(2);
        chai_1.expect(putSub.noOfMeals).to.equal(1);
        chai_1.expect(putSub.box).to.equal("engangsboks");
        const getSub = await vendor.getVendorSubscription(usermail);
        chai_1.expect(getSub.vendorId).to.equal(vendormail);
        chai_1.expect(getSub.userId).to.equal(usermail);
        chai_1.expect(getSub.approved).to.equal(false);
        chai_1.expect(getSub.paused).to.equal(true);
        chai_1.expect(getSub.schedule.length).to.equal(2);
        chai_1.expect(getSub.noOfMeals).to.equal(1);
        chai_1.expect(getSub.box).to.equal("engangsboks");
        const getSubscriptions = await vendor.getVendorSubscriptions();
        chai_1.expect(getSubscriptions.length).to.equal(1);
        chai_1.expect(getSubscriptions[0].vendorId).to.equal(vendormail);
        chai_1.expect(getSubscriptions[0].userId).to.equal(usermail);
        chai_1.expect(getSubscriptions[0].approved).to.not.equal(true);
        chai_1.expect(getSubscriptions[0].paused).to.not.equal(false);
        chai_1.expect(getSubscriptions[0].schedule.length).to.equal(2);
        chai_1.expect(getSubscriptions[0].noOfMeals).to.not.equal(3);
        chai_1.expect(getSubscriptions[0].box).to.equal("engangsboks");
        let httpresult = await user.putUserSubscription(sub1);
        chai_1.expect(httpresult.statusCode).to.equal(undefined);
    });
    mocha_1.afterEach(async function () {
        await vendor.logout();
    });
});
//# sourceMappingURL=userSubscription.test.js.map