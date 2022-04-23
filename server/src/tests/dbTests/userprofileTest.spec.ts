require('dotenv').config();
import 'source-map-support/register';
import { deleteUserprofileInDb, getUserprofileFromDb, putUserprofileInDb } from '../../dbUtils';
import { expect } from 'chai';
import 'mocha';

const approved: "new" | "approved" | "denied" = "new";

describe('User profile test', () => {
  it('Putting, getting and deleting a userprofile', async () => {
    let userprofile = {
      fullname: "Navn",
      address: "Skogen",
      deliveryAddress: "Havet",
      phone: "12345",
      email: "hallo@post.no",
      allergies: ["melk"],
      approved,
      isVendor: false
    };

    const putResult = await putUserprofileInDb(userprofile, "testUserId44", false);
    expect(putResult.fullname).to.equal("Navn");
    expect(putResult.address).to.equal("Skogen");
    expect(putResult.deliveryAddress).to.equal("Havet");
    expect(putResult.phone).to.equal("12345");
    expect(putResult.email).to.equal("hallo@post.no");
    expect(putResult.allergies).to.deep.equal(["melk"]);

    const getResult = await getUserprofileFromDb("testUserId44");
    expect(getResult.fullname).to.equal("Navn");
    expect(getResult.address).to.equal("Skogen");
    expect(getResult.phone).to.equal("12345");
    expect(getResult.email).to.equal("hallo@post.no");
    // expect(getResult.allergies).to.deep.equal(["melk"]);

    await deleteUserprofileInDb("testUserId44");
    const newResult = await getUserprofileFromDb("testUserId44");
    expect(newResult).to.equal(undefined);
  });
});



