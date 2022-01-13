require('dotenv').config();
import 'source-map-support/register';
import { Api } from '../../../../clients/webclient/src/api/api';
import { testUser, testPass } from '../../../../common/settings';
import { expect } from 'chai';
import 'mocha';
import { afterEach, beforeEach } from 'mocha';

let user = null;
let mail = testUser;

describe('Userprofile for user http test', () => {
  beforeEach(async function () {
    user = new Api();
    await user.login(testUser, testPass);

  });
  it('userProfile user check, put, get and delete', async () => {
    let userprofile = {
      fullname: "Hjørdis",
      address: "Skogen",
      deliveryAddress: "Kronstad 3",
      phone: "12345678",
      email: mail,
      allergies: ["melk"],
      isVendor: false
    };

    let putRes = await user.putUserprofile(userprofile);
    expect(putRes.fullname).to.equal("Hjørdis");
    expect(putRes.address).to.equal("Skogen");
    expect(putRes.phone).to.equal("12345678");
    expect(putRes.email).to.equal(mail);
    expect(putRes.allergies[0]).to.equal("melk");
    expect(putRes.isVendor).to.equal(false);

    let getRes = await user.getUserprofile()
    expect(getRes.fullname).to.eql("Hjørdis");
    expect(getRes.fullname).to.not.equal("Trude");
    expect(getRes.address).to.equal("Skogen");
    expect(getRes.phone).to.equal("12345678");
    expect(getRes.email).to.equal(mail);
    expect(getRes.allergies[0]).to.equal("melk");
    expect(getRes.allergies).to.not.equal("sennep")
    expect(getRes.isVendor).to.equal(false);

    await user.deleteUserprofile();
    let newRes = await user.getUserprofile();
    expect(newRes).to.equal(null);
    await user.putUserprofile(userprofile)
    
  });
  afterEach(async function () {
    await user.logout();
  });
  });

