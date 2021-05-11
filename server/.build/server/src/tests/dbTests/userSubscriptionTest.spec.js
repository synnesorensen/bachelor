"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
require("source-map-support/register");
const dbUtils_1 = require("../../dbUtils");
const chai_1 = require("chai");
require("mocha");
describe('Test of user subscriptions', () => {
    it('Getting list of subscriptions with users info from DB', async () => {
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
        const sub1 = {
            vendorId: "testVendorId40",
            userId: "testUserId1",
            approved: true,
            paused: false,
            schedule: ["1", "2"],
            noOfMeals: 1,
            box: "engangsboks"
        };
        const user1 = {
            fullname: "Navn Navnesen",
            address: "Skogen 110",
            phone: "123456",
            email: "gjøk@skogen.no",
            allergies: [],
            isVendor: false
        };
        const sub2 = {
            vendorId: "testVendorId40",
            userId: "testUserId2",
            approved: false,
            paused: true,
            schedule: ["2"],
            noOfMeals: 1,
            box: "gjenbruksboks"
        };
        const user2 = {
            fullname: "Name Nameson",
            address: "Viken 84",
            phone: "456789",
            email: "party@viken.no",
            allergies: ["melk"],
            isVendor: false
        };
        await dbUtils_1.putVendorInDb(vendor, "testVendorId40");
        await dbUtils_1.putUserprofileInDb(user1, "testUserId1");
        await dbUtils_1.putUserprofileInDb(user2, "testUserId2");
        await dbUtils_1.putSubscriptionInDb(sub1, false);
        await dbUtils_1.putSubscriptionInDb(sub2, false);
        const getResult = await dbUtils_1.getSubscriptionsForVendor("testVendorId40");
        chai_1.expect(getResult.length).to.equal(2);
        let res1 = getResult.find(({ userId }) => userId === "testUserId1");
        chai_1.expect(res1.fullname).to.equal("Navn Navnesen");
        chai_1.expect(res1.address).to.equal("Skogen 110");
        chai_1.expect(res1.phone).to.equal("123456");
        chai_1.expect(res1.email).to.equal("gjøk@skogen.no");
        chai_1.expect(res1.allergies).to.eql([]);
        chai_1.expect(res1.approved).to.equal(false);
        chai_1.expect(res1.paused).to.equal(false);
        chai_1.expect(res1.schedule[0].id).to.equal("1");
        chai_1.expect(res1.schedule[1].id).to.equal("2");
        let res2 = getResult.find(({ userId }) => userId === "testUserId2");
        chai_1.expect(res2.fullname).to.equal("Name Nameson");
        chai_1.expect(res2.address).to.equal("Viken 84");
        chai_1.expect(res2.phone).to.equal("456789");
        chai_1.expect(res2.email).to.equal("party@viken.no");
        chai_1.expect(res2.allergies).to.eql(["melk"]);
        chai_1.expect(res2.approved).to.equal(false);
        chai_1.expect(res2.paused).to.equal(true);
        chai_1.expect(res2.schedule[0].id).to.equal("2");
        await dbUtils_1.deleteUserprofileInDb("testUserId1");
        await dbUtils_1.deleteUserprofileInDb("testUserId2");
        await dbUtils_1.deleteSubscriptionInDb("testVendorId40", "testUserId1");
        await dbUtils_1.deleteSubscriptionInDb("testVendorId40", "testUserId2");
        await dbUtils_1.deleteVendorInDb("testVendorId40");
    });
});
//# sourceMappingURL=userSubscriptionTest.spec.js.map