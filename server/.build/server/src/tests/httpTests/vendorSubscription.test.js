"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
require("source-map-support/register");
const api_1 = require("../../../../clients/webclient/src/api/api");
const chai_1 = require("chai");
const settings_1 = require("../../../../common/settings");
require("mocha");
const mocha_1 = require("mocha");
let user = null;
let vendor = null;
let usermail = settings_1.testUser;
let vendormail = settings_1.testVend;
describe('Subscription vendor http test', () => {
    mocha_1.beforeEach(async function () {
        vendor = new api_1.Api();
        user = new api_1.Api();
        await user.login(settings_1.testUser, settings_1.testPass);
        await vendor.login(settings_1.testVend, settings_1.testVendPass);
    });
    it('Putting, getting and deleting a subscription', async () => {
        const sub = {
            vendorId: vendormail,
            userId: usermail,
            approved: false,
            paused: true,
            schedule: ["2", "3"],
            noOfMeals: 1,
            box: "engangsboks"
        };
        const putResult = await user.putUserSubscription(sub);
        chai_1.expect(putResult.vendorId).to.equal(vendormail);
        chai_1.expect(putResult.userId).to.equal(usermail);
        chai_1.expect(putResult.approved).to.equal(false);
        chai_1.expect(putResult.paused).to.equal(true);
        chai_1.expect(putResult.schedule).to.eql(["2", "3"]);
        const getResult = await user.getUserSubscriptions();
        chai_1.expect(getResult[0].vendorId).to.equal(vendormail);
        chai_1.expect(getResult[0].noOfMeals).equal(1);
        chai_1.expect(getResult[0].box).to.equal("engangsboks");
        chai_1.expect(getResult[0].approved).to.equal(false);
        chai_1.expect(getResult[0].paused).to.equal(true);
        chai_1.expect(getResult[0].schedule.length).to.equal(2);
        const userSub = await user.getUserSubscription(vendormail);
        chai_1.expect(userSub.vendorId).to.equal(vendormail);
        chai_1.expect(userSub.userId).to.equal(usermail);
        chai_1.expect(userSub.approved).to.equal(false);
        chai_1.expect(userSub.paused).to.equal(true);
        chai_1.expect(userSub.schedule.length).to.equal(2);
        chai_1.expect(userSub.noOfMeals).to.equal(1);
        chai_1.expect(userSub.box).to.equal("engangsboks");
        let httpresult = await vendor.putVendorSubscription(sub);
        chai_1.expect(httpresult.statusCode).to.equal(undefined);
        await user.deleteUserSubscription(vendormail);
        const newResult = await user.getUserSubscription(vendormail);
        chai_1.expect(newResult).to.equal(null);
        await user.putUserSubscription(sub);
    });
    mocha_1.afterEach(async function () {
        await vendor.logout();
    });
});
//# sourceMappingURL=vendorSubscription.test.js.map