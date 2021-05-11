"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
require("source-map-support/register");
const dbUtils_1 = require("../../dbUtils");
const chai_1 = require("chai");
require("mocha");
describe('Subscription test', () => {
    it('Putting, getting and deleting a subscription', async () => {
        const vendor = {
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
            approved: false,
            paused: true,
            schedule: ["1", "2"],
            noOfMeals: 1,
            box: "engangsboks"
        };
        await dbUtils_1.putVendorInDb(vendor, "testVendorId55");
        const putResult = await dbUtils_1.putSubscriptionInDb(sub, true);
        chai_1.expect(putResult.vendorId).to.equal("testVendorId55");
        chai_1.expect(putResult.userId).to.equal("testUserId55");
        chai_1.expect(putResult.approved).to.equal(false);
        chai_1.expect(putResult.paused).to.equal(true);
        chai_1.expect(putResult.schedule).to.eql(["1", "2"]);
        const getResult = await dbUtils_1.getSubscriptionFromDb("testVendorId55", "testUserId55");
        chai_1.expect(getResult.vendorId).to.equal("testVendorId55");
        chai_1.expect(getResult.userId).to.equal("testUserId55");
        chai_1.expect(getResult.approved).to.equal(false);
        chai_1.expect(getResult.paused).to.equal(true);
        chai_1.expect(getResult.schedule[0]).to.equal("1");
        chai_1.expect(getResult.schedule[1]).to.equal("2");
        await dbUtils_1.deleteSubscriptionInDb("testVendorId55", "testUserId55");
        const newResult = await dbUtils_1.getSubscriptionFromDb("testVendorId55", "testUserId55");
        chai_1.expect(newResult).to.equal(undefined);
        await dbUtils_1.deleteVendorInDb("testVendorId55");
    });
});
//# sourceMappingURL=subscritionTest.spec.js.map