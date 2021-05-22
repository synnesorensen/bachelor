require('dotenv').config();
import 'source-map-support/register';
import { Api } from '../../../../clients/webclient/src/api/api';
import { expect } from 'chai';
import { testPass, testUser, testVend, testVendPass} from '../../../../common/settings';
import 'mocha';
import { afterEach, beforeEach } from 'mocha';

let user = null;
let vendor = null;
let usermail = testUser;
let vendormail = testVend;

describe('Subscription vendor http test', () => {
    beforeEach(async function () {
        vendor = new Api();
        user = new Api();
        await user.login(testUser, testPass);
        await vendor.login(testVend, testVendPass);

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
        expect(putResult.vendorId).to.equal(vendormail);
        expect(putResult.userId).to.equal(usermail);
        expect(putResult.approved).to.equal(false);
        expect(putResult.paused).to.equal(true);
        expect(putResult.schedule).to.eql(["2", "3"]);
        
        const getResult = await user.getUserSubscriptions();
        expect(getResult[0].vendorId).to.equal(vendormail);
        expect(getResult[0].noOfMeals).equal(1);
        expect(getResult[0].box).to.equal("engangsboks");
        expect(getResult[0].approved).to.equal(false);
        expect(getResult[0].paused).to.equal(true);
        expect(getResult[0].schedule.length).to.equal(2);

        const getSingleResult = await user.getSingleSubscription();
        expect(getSingleResult.vendorId).to.equal(vendormail);
        expect(getSingleResult.approved).to.equal(false);

        const userSub = await user.getUserSubscription(vendormail);
        expect(userSub.vendorId).to.equal(vendormail);
        expect(userSub.userId).to.equal(usermail);
        expect(userSub.approved).to.equal(false);
        expect(userSub.paused).to.equal(true);
        expect(userSub.schedule.length).to.equal(2);
        expect(userSub.noOfMeals).to.equal(1);
        expect(userSub.box).to.equal("engangsboks");

        let httpresult = await vendor.putVendorSubscription(sub);
        expect(httpresult.statusCode).to.equal(undefined);
        
        await user.deleteUserSubscription(vendormail);
        const newResult = await user.getUserSubscription(vendormail);
        expect(newResult).to.equal(null); 
        await user.putUserSubscription(sub);


    });
    afterEach(async function () {
        await vendor.logout();
    });
});