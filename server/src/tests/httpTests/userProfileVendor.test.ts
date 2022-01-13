require('dotenv').config();
import 'source-map-support/register';
import { Api } from '../../../../clients/webclient/src/api/api';
import { testVend, testVendPass } from '../../../../common/settings';
import { expect } from 'chai';
import 'mocha';
import { afterEach, beforeEach } from 'mocha';

let user = null;
const mail = testVend;

describe('Userprofile for vendor http test', () => {
  beforeEach(async function () {
    user = new Api();
    await user.login(testVend, testVendPass);
  });
  it('userProfile vendor check, get and put', async () => {
    let userprofile = {
      fullname: "Ing Ping",
      address: "Hjemme",
      deliveryAddress: "Kronstad 5",
      phone: "98765432",
      email: mail,
      allergies: ["melk"],
      isVendor: true
    };

    let putRes = await user.putUserprofile(userprofile);
    expect(putRes.fullname).to.equal("Ing Ping");
    expect(putRes.address).to.equal("Hjemme");
    expect(putRes.phone).to.equal("98765432");
    expect(putRes.email).to.equal(mail);
    expect(putRes.allergies[0]).to.equal("melk");
    expect(putRes.isVendor).to.equal(true);
    expect(putRes.isVendor).to.not.equal(false);

    let getRes = await user.getUserprofile()
    expect(getRes.fullname).to.equal("Ing Ping");
    expect(getRes.fullname).to.not.equal("Johnny");
    expect(getRes.address).to.equal("Hjemme");
    expect(getRes.phone).to.equal("98765432");
    expect(getRes.email).to.equal(mail);
    expect(getRes.allergies[0]).to.equal("melk");
    expect(getRes.allergies.length).to.equal(1);
    expect(getRes.isVendor).to.equal(true);

  });
  afterEach(async function () {
    await user.logout();
  });
});

