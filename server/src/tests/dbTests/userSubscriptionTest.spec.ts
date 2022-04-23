require('dotenv').config();
import 'source-map-support/register';
import { deleteSubscriptionInDb, deleteUserprofileInDb, getSubscriptionsForVendor, putSubscriptionInDb, putUserprofileInDb, putVendorInDb } from '../../dbUtils';
import { expect } from 'chai';
import 'mocha';

const approved: "new" | "approved" | "denied" = "new";

describe('Test of user subscriptions', () => {
  it('Getting list of subscriptions with users info from DB', async () => {
    const vendor = {
      vendorId: "testVendorId40",
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
      paused: false,
      schedule: ["1", "2"], 
      noOfMeals: 1,
      box: "engangsboks"
    };
    const user1 = {
      fullname: "Navn Navnesen",
      address: "Skogen 110",
      deliveryAddress: "Nøstet 3",
      phone: "123456",
      email: "gjøk@skogen.no", 
      allergies: [],
      approved,
      isVendor: false
    };
    const sub2 = {
      vendorId: "testVendorId40",
      userId: "testUserId2",
      paused: true,
      schedule: ["2"],
      noOfMeals: 1,
      box: "gjenbruksboks"
    };
    const user2 = {
      fullname: "Name Nameson",
      address: "Viken 84",
      deliveryAddress: "Hjørnet 2",
      phone: "456789",
      email: "party@viken.no",
      allergies: ["melk"],
      approved,
      isVendor: false
    };

    await putVendorInDb(vendor, "testVendorId40");
    await putUserprofileInDb(user1, "testUserId1", false);
    await putUserprofileInDb(user2, "testUserId2", false);
    await putSubscriptionInDb(sub1);
    await putSubscriptionInDb(sub2);

    const getResult = await getSubscriptionsForVendor("testVendorId40");
    expect(getResult.length).to.equal(2);

    let res1 = getResult.find( ({userId}) => userId === "testUserId1");
    expect(res1.fullname).to.equal("Navn Navnesen");
    expect(res1.address).to.equal("Skogen 110");
    expect(res1.phone).to.equal("123456");
    expect(res1.email).to.equal("gjøk@skogen.no");
    expect(res1.allergies).to.eql([]);
    expect(res1.approved).to.equal(false);
    expect(res1.paused).to.equal(false);
    expect(res1.schedule[0].id).to.equal("1");
    expect(res1.schedule[1].id).to.equal("2");

    let res2 = getResult.find( ({userId}) => userId === "testUserId2");
    expect(res2.fullname).to.equal("Name Nameson");
    expect(res2.address).to.equal("Viken 84");
    expect(res2.phone).to.equal("456789");
    expect(res2.email).to.equal("party@viken.no");
    // expect(res2.allergies).to.deep.equal("melk");
    expect(res2.approved).to.equal(false);
    expect(res2.paused).to.equal(true);
    expect(res2.schedule[0].id).to.equal("2");

    await deleteUserprofileInDb("testUserId1");
    await deleteUserprofileInDb("testUserId2");
    await deleteSubscriptionInDb("testVendorId40", "testUserId1");
    await deleteSubscriptionInDb("testVendorId40", "testUserId2"); 
  });

});