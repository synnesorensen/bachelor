require('dotenv').config();
import 'source-map-support/register';
import { deleteSubscriptionInDb, getSubscriptionFromDb, putSubscriptionInDb } from '../dbUtils';
import { expect } from 'chai';
import 'mocha';

describe('Subscription test', () => {
    it('Putting, getting and deleting a subscription', async () => {
        const sub = {
            vendorId: "testVendorId",
            userId: "testUserId",
            approved: false,
            paused: true,
            schedule: ["1", "2"]
        };

        const putResult = await putSubscriptionInDb(sub, true);
        expect(putResult.vendorId).to.equal("testVendorId");
        expect(putResult.userId).to.equal("testUserId");
        expect(putResult.approved).to.equal(false);
        expect(putResult.paused).to.equal(true);
        expect(putResult.schedule).to.eql(["1", "2"]);
        
        const getResult = await getSubscriptionFromDb("testVendorId", "testUserId");
        expect(getResult.vendorId).to.equal(undefined);
        expect(getResult.userId).to.equal("testUserId");
        expect(getResult.approved).to.equal(false);
        expect(getResult.paused).to.equal(true);
        expect(getResult.schedule).to.eql(["1", "2"]);

        await deleteSubscriptionInDb("testVendorId", "testUserId");
        const newResult = await getSubscriptionFromDb("testVendorId", "testUserId");
        expect(newResult).to.equal(undefined);
    });
});