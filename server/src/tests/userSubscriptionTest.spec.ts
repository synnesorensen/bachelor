require('dotenv').config();
import 'source-map-support/register';
import { deleteSubscriptionInDb, deleteUserprofileInDb, getSubscriptionsForVendor, putSubscriptionInDb, putUserprofileInDb } from '../dbUtils';
import { expect } from 'chai';
import 'mocha';

describe('Test of user subscriptions', () => {
    it('Getting list of subscriptions with users info from DB', async () => {
        const sub1 = {
            vendorId: "testVendorId",
            userId: "testUserId1",
            approved: true,
            paused: false,
            schedule: ["1", "2"]
        };
        const user1 = {
            fullname: "Navn Navnesen",
            address: "Skogen 110",
            phone: "123456",
            email: "gjøk@skogen.no", 
            allergies: [""]
        };
        const sub2 = {
            vendorId: "testVendorId",
            userId: "testUserId2",
            approved: false,
            paused: true,
            schedule: ["2", "3"]
        };
        const user2 = {
            fullname: "Name Nameson",
            address: "Viken 84",
            phone: "456789",
            email: "party@viken.no",
            allergies: ["melk"]
        };

        await putUserprofileInDb(user1, "testUserId1");
        await putUserprofileInDb(user2, "testUserId2");
        await putSubscriptionInDb(sub1, false);
        await putSubscriptionInDb(sub2, false);

        const getResult = await getSubscriptionsForVendor("testVendorId");
        expect(getResult.length).to.equal(2);

        let res1 = getResult.find( ({userId}) => userId === "testUserId1");
        expect(res1.fullname).to.equal("Navn Navnesen");
        expect(res1.address).to.equal("Skogen 110");
        expect(res1.phone).to.equal("123456");
        expect(res1.email).to.equal("gjøk@skogen.no");
        expect(res1.allergies).to.eql([""]);
        expect(res1.approved).to.equal(false);
        expect(res1.paused).to.equal(false);
        expect(res1.schedule).to.eql(["1", "2"]);

        let res2 = getResult.find( ({userId}) => userId === "testUserId2");
        expect(res2.fullname).to.equal("Name Nameson");
        expect(res2.address).to.equal("Viken 84");
        expect(res2.phone).to.equal("456789");
        expect(res2.email).to.equal("party@viken.no");
        expect(res2.allergies).to.eql(["melk"]);
        expect(res2.approved).to.equal(false);
        expect(res2.paused).to.equal(true);
        expect(res2.schedule).to.eql(["2", "3"]);

        await deleteUserprofileInDb("testUserId1");
        await deleteUserprofileInDb("testUserId2");
        await deleteSubscriptionInDb("testVendorId", "testUserId1");
        await deleteSubscriptionInDb("testVendorId", "testUserId2"); 
    });

});