require('dotenv').config();
import 'source-map-support/register';
import { deleteSubscriptionInDb, deleteUserprofileInDb, deleteVendorInDb, getSubscriptionsForUser, getUserprofileFromDb, putSubscriptionInDb, putUserprofileInDb, putVendorInDb } from '../../dbUtils';
import { expect } from 'chai';
import 'mocha';

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
        }
        const user1 = {
            fullname: "Navn Navnesen",
            address: "Skogen 110",
            phone: "123456",
            email: "gjøk@skogen.no", 
            allergies: [""],
            isVendor: false
        };
        const vendor1 = {
            vendorId: "testVendorId10",
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
            vendorId: "testVendorId20",
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

        await putUserprofileInDb(user1, "testUserId30");
        await putSubscriptionInDb(sub1, true);
        await putSubscriptionInDb(sub2, false);
        await putVendorInDb(vendor1, "testVendorId10");
        await putVendorInDb(vendor2, "testVendorId20");

        const getResult = await getSubscriptionsForUser("testUserId30");
        expect(getResult.length).to.equal(2);

        let res1 = getResult.find( ({vendorId}) => vendorId === "testVendorId10");
        expect(res1.company).to.equal("Delikatessen");
        expect(res1.approved).to.equal(true);
        expect(res1.paused).to.equal(false);
        expect(res1.schedule[0].id).to.eql("1");

        let res2 = getResult.find( ({vendorId}) => vendorId === "testVendorId20");
        expect(res2.company).to.equal("Asian Fusion");
        expect(res2.approved).to.equal(false);
        expect(res2.paused).to.equal(true);
        expect(res2.schedule[0].id).to.eql("5");

        await deleteSubscriptionInDb("testVendorId10", "testUserId30");
        await deleteSubscriptionInDb("testVendorId20", "testUserId30");
        const newGet2 = await getSubscriptionsForUser("testUserId30");
        expect(newGet2).to.equal(undefined);
        await deleteUserprofileInDb("testUserId30");
        const newGet1 = await getUserprofileFromDb("testUserId30");
        expect(newGet1).to.equal(undefined);
        await deleteVendorInDb("testVendorId10");
        await deleteVendorInDb("testVendorId20");
    });
});


