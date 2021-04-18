require('dotenv').config();
import 'source-map-support/register';
import { deleteSubscriptionInDb, deleteUserprofileInDb, deleteVendorInDb, getSubscriptionsForUser, getUserprofileFromDb, putSubscriptionInDb, putUserprofileInDb, putVendorInDb } from '../dbUtils';
import { expect } from 'chai';
import 'mocha';

describe('Test of vendor subscriptions', () => {

    it('Getting list of subscriptions with vendor info from DB', async () => {
        const sub1 = {
            vendorId: "testVendorId1",
            userId: "testUserId",
            approved: true,
            paused: false,
            schedule: ["1", "2"],
            noOfMeals: "1",
            box: "engangsboks"
        };
        const sub2 = {
            vendorId: "testVendorId2",
            userId: "testUserId",
            approved: true,
            paused: true,
            schedule: ["5", "7"],
            noOfMeals: "1",
            box: "gjenbruksboks"
        }
        const user1 = {
            fullname: "Navn Navnesen",
            address: "Skogen 110",
            phone: "123456",
            email: "gjøk@skogen.no", 
            allergies: [""]
        };
        const vendor1 = {
            company: "Delikatessen",
            fullname: "Bakemester Harepus",
            address: "Hakkebakkeskogen",
            phone: "448866",
            email: "harepus@skogen.no",
            schedule: ["1", "2", "3", "4", "5"]
        };
        const vendor2 = {
            company: "Asian Fusion",
            fullname: "Kim Lee",
            address: "Osloveien 45",
            phone: "48523",
            email: "fusion@asia.com",
            schedule: ["3", "4", "5", "6", "7"] 
        };

        await putUserprofileInDb(user1, "testUserId");
        await putSubscriptionInDb(sub1, true);
        await putSubscriptionInDb(sub2, false);
        await putVendorInDb(vendor1, "testVendorId1");
        await putVendorInDb(vendor2, "testVendorId2");

        const getResult = await getSubscriptionsForUser("testUserId");
        expect(getResult.length).to.equal(2);

        let res1 = getResult.find( ({vendorId}) => vendorId === "testVendorId1");
        expect(res1.company).to.equal("Delikatessen");
        expect(res1.approved).to.equal(true);
        expect(res1.paused).to.equal(false);
        expect(res1.schedule).to.eql(["1", "2"]);

        let res2 = getResult.find( ({vendorId}) => vendorId === "testVendorId2");
        expect(res2.company).to.equal("Asian Fusion");
        expect(res2.approved).to.equal(false);
        expect(res2.paused).to.equal(true);
        expect(res2.schedule).to.eql(["5", "7"]);

        await deleteSubscriptionInDb("testVendorId1", "testUserId");
        await deleteSubscriptionInDb("testVendorId2", "testUserId");
        const newGet2 = await getSubscriptionsForUser("testUserId");
        expect(newGet2).to.equal(undefined);
        await deleteUserprofileInDb("testUserId");
        const newGet1 = await getUserprofileFromDb("testUserId");
        expect(newGet1).to.equal(undefined);
        await deleteVendorInDb("testVendorId1");
        await deleteVendorInDb("testVendorId2");
    });
});


