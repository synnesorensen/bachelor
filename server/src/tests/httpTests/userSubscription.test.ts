require('dotenv').config();
import 'source-map-support/register';
import { Api } from '../../../../clients/webclient/src/api/api';
import { expect } from 'chai';
import { testUser, testPass, testVend, testVendPass } from '../../../../common/settings';
import 'mocha';
import { afterEach, beforeEach } from 'mocha';

let vendor = null;
let user = null;
const vendormail = testVend;
const usermail = testUser;

describe('Users subscriptions http test', () => {
    beforeEach(async function () {
        vendor = new Api();
        user = new Api();
        await vendor.login(testVend, testVendPass);
        await user.login(testUser, testPass);

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
        expect(putSub.vendorId).to.equal(vendormail);
        expect(putSub.userId).to.equal(usermail);
        expect(putSub.approved).to.equal(false);
        expect(putSub.paused).to.equal(true)
        expect(putSub.schedule.length).to.equal(2);
        expect(putSub.noOfMeals).to.equal(1);
        expect(putSub.box).to.equal("engangsboks");

        const getSub = await vendor.getVendorSubscription(usermail);
        expect(getSub.vendorId).to.equal(vendormail);
        expect(getSub.userId).to.equal(usermail);
        expect(getSub.approved).to.equal(false);
        expect(getSub.paused).to.equal(true)
        expect(getSub.schedule.length).to.equal(2);
        expect(getSub.noOfMeals).to.equal(1);
        expect(getSub.box).to.equal("engangsboks");

        const getSubscriptions = await vendor.getVendorSubscriptions();
        expect(getSubscriptions.length).to.equal(1);
        expect(getSubscriptions[0].vendorId).to.equal(vendormail);
        expect(getSubscriptions[0].userId).to.equal(usermail);
        expect(getSubscriptions[0].approved).to.not.equal(true);
        expect(getSubscriptions[0].paused).to.not.equal(false);
        expect(getSubscriptions[0].schedule.length).to.equal(2);
        expect(getSubscriptions[0].noOfMeals).to.not.equal(3);
        expect(getSubscriptions[0].box).to.equal("engangsboks");

        let httpresult = await user.putUserSubscription(sub1);
        expect(httpresult.statusCode).to.equal(undefined);

    });
    afterEach(async function () {
        await vendor.logout();
    });
});