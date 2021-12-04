require('dotenv').config();
import 'source-map-support/register';
import { deleteSubscriptionInDb, getSubscriptionFromDb, putSubscriptionInDb, putVendorInDb } from '../../dbUtils';
import { expect } from 'chai';
import 'mocha';

describe('Subscription test', () => {
    it('Putting, getting and deleting a subscription', async () => {
        const vendor = {
            vendorId: "testVendorId55",
            company: "Delikatessen",
            fullname: "Bakermester Harepus",
            address: "Hakkebakkeskogen",
            phone: "6688552",
            email: "harepus@skogen.no",
            schedule: [
                {
                    "id": "1",
                    "day": "tuesday",
                    "time": "10",
                    "menu": "Veggie lunch"
                },
                {
                    "id": "2",
                    "day": "wednesday",
                    "time": "10",
                    "menu": "Fish lunch"
                }
            ]
        };

        const sub = {
            vendorId: "testVendorId55",
            userId: "testUserId55",
            paused: true,
            schedule: ["1", "2"], 
            noOfMeals: 1,
            box: "engangsboks"
        };

        await putVendorInDb(vendor, "testVendorId55");
        const putResult = await putSubscriptionInDb(sub);
        expect(putResult.vendorId).to.equal("testVendorId55");
        expect(putResult.userId).to.equal("testUserId55");
        expect(putResult.paused).to.equal(true);
        expect(putResult.schedule).to.eql(["1", "2"]);
        
        const getResult = await getSubscriptionFromDb("testVendorId55", "testUserId55");
        expect(getResult.vendorId).to.equal("testVendorId55");
        expect(getResult.userId).to.equal("testUserId55");
        expect(getResult.paused).to.equal(true);
        expect(getResult.schedule[0]).to.equal("1");
        expect(getResult.schedule[1]).to.equal("2");

        await deleteSubscriptionInDb("testVendorId55", "testUserId55");
        const newResult = await getSubscriptionFromDb("testVendorId55", "testUserId55");
        expect(newResult).to.equal(null);
    });
});