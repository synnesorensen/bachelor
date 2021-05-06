require('dotenv').config();
import 'source-map-support/register';
import { Api } from '../../../../clients/webclient/src/api/api';
import { expect } from 'chai';
import { testPass, testUser, testVend, testVendPass} from '../../../../common/settings';
import 'mocha';
import { afterEach, beforeEach } from 'mocha';

let user = null;
let vendor = null;
let usermail = "ingrid.elisabeth.hjelle+test50@gmail.com";
let vendormail = "ingrid.elisabeth.hjelle+test97@gmail.com";

describe('Subscription vendor test', () => {
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
            schedule: ["1", "2"], 
            noOfMeals: 1,
            box: "engangsboks"
        };

        const putResult = await user.putUserSubscription(sub);
        expect(putResult.vendorId).to.equal(vendormail);
        expect(putResult.userId).to.equal(usermail);
        expect(putResult.approved).to.equal(false);
        expect(putResult.paused).to.equal(true);
        expect(putResult.schedule).to.eql(["1", "2"]);
        
        const getResult = await user.getUserSubscriptions();
        expect(getResult[0].vendorId).to.equal(vendormail);
        expect(getResult[0].noOfMeals).equal(1);
        expect(getResult[0].box).to.equal("engangsboks");
        expect(getResult[0].approved).to.equal(false);
        expect(getResult[0].paused).to.equal(true);
        expect(getResult[0].schedule.length).to.equal(2);

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


    }).timeout(5000);
    afterEach(async function () {
        await vendor.logout();
    });
});