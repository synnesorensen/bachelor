"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
require("source-map-support/register");
const dbUtils_1 = require("../../dbUtils");
const chai_1 = require("chai");
require("mocha");
describe('Test of vendor subscriptions', () => {
    it('Getting list of subscriptions with vendor info from DB', async () => {
        const sub1 = {
            vendorId: "testVendorId10",
            userId: "testUserId30",
            approved: true,
            paused: false,
            schedule: ["1", "2"],
            noOfMeals: 1,
            box: "engangsboks"
        };
        const sub2 = {
            vendorId: "testVendorId20",
            userId: "testUserId30",
            approved: true,
            paused: true,
            schedule: ["5", "7"],
            noOfMeals: 1,
            box: "gjenbruksboks"
        };
        const user1 = {
            fullname: "Navn Navnesen",
            address: "Skogen 110",
            phone: "123456",
            email: "gjøk@skogen.no",
            allergies: [""],
            isVendor: false
        };
        const vendor1 = {
            company: "Delikatessen",
            fullname: "Bakemester Harepus",
            address: "Hakkebakkeskogen",
            phone: "448866",
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
        const vendor2 = {
            company: "Asian Fusion",
            fullname: "Kim Lee",
            address: "Osloveien 45",
            phone: "48523",
            email: "fusion@asia.com",
            schedule: [
                {
                    "id": "5",
                    "day": "tuesday",
                    "time": "10",
                    "menu": "Veggie lunch"
                },
                {
                    "id": "7",
                    "day": "wednesday",
                    "time": "10",
                    "menu": "Fish lunch"
                }
            ]
        };
        await dbUtils_1.putUserprofileInDb(user1, "testUserId30");
        await dbUtils_1.putSubscriptionInDb(sub1, true);
        await dbUtils_1.putSubscriptionInDb(sub2, false);
        await dbUtils_1.putVendorInDb(vendor1, "testVendorId10");
        await dbUtils_1.putVendorInDb(vendor2, "testVendorId20");
        const getResult = await dbUtils_1.getSubscriptionsForUser("testUserId30");
        chai_1.expect(getResult.length).to.equal(2);
        let res1 = getResult.find(({ vendorId }) => vendorId === "testVendorId10");
        chai_1.expect(res1.company).to.equal("Delikatessen");
        chai_1.expect(res1.approved).to.equal(true);
        chai_1.expect(res1.paused).to.equal(false);
        chai_1.expect(res1.schedule[0].id).to.eql("1");
        let res2 = getResult.find(({ vendorId }) => vendorId === "testVendorId20");
        chai_1.expect(res2.company).to.equal("Asian Fusion");
        chai_1.expect(res2.approved).to.equal(false);
        chai_1.expect(res2.paused).to.equal(true);
        chai_1.expect(res2.schedule[0].id).to.eql("5");
        await dbUtils_1.deleteSubscriptionInDb("testVendorId10", "testUserId30");
        await dbUtils_1.deleteSubscriptionInDb("testVendorId20", "testUserId30");
        const newGet2 = await dbUtils_1.getSubscriptionsForUser("testUserId30");
        chai_1.expect(newGet2).to.equal(undefined);
        await dbUtils_1.deleteUserprofileInDb("testUserId30");
        const newGet1 = await dbUtils_1.getUserprofileFromDb("testUserId30");
        chai_1.expect(newGet1).to.equal(undefined);
        await dbUtils_1.deleteVendorInDb("testVendorId10");
        await dbUtils_1.deleteVendorInDb("testVendorId20");
    });
});
//# sourceMappingURL=vendorSubscriptionTest.spec.js.map