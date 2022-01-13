require('dotenv').config();
import 'source-map-support/register';
import { Api } from '../../../../clients/webclient/src/api/api';
import { testUser, testPass, testVend, testVendPass } from '../../../../common/settings';
import { expect } from 'chai';
import 'mocha';
import { afterEach, beforeEach } from 'mocha';

let vendor = null;
let user = null
const vendormail = testVend;
const usermail = testUser; 

describe('Delivery, user and vedorDeliveries http test', () => {
  beforeEach(async function () {
    vendor = new Api();
    user = new Api();
    await vendor.login(testVend, testVendPass);
    await user.login(testUser, testPass);

  });
  it('Put, get and delete a delivery', async () => {
    let delivery1 = {
      vendorId: vendormail,
      userId: usermail,
      deliverytime: "2021-04-20T00:10:00.000Z",
      menuId: "1",
      cancelled: false
    };
    let delivery2 = {
      vendorId: vendormail,
      userId: usermail,
      deliverytime: "2021-04-01T00:10:00.000Z",
      menuId: "2",
      cancelled: true
    };
    let delivery3 = {
      vendorId: vendormail,
      userId: usermail,
      deliverytime: "2021-05-01T00:10:00.000Z",
      menuId: "1",
      cancelled: false
    };
    let delivery4 = {
      vendorId: vendormail,
      userId: usermail,
      deliverytime: "2021-05-31T00:10:00.000Z",
      menuId: "2",
      cancelled: false
    };

    //Testing delivery  /delivery
    const putResult1 = await vendor.putDelivery(vendormail, usermail, delivery1);
    expect(putResult1.vendorId).to.not.equal(usermail);
    expect(putResult1.userId).to.not.equal(vendormail);
    expect(putResult1.deliverytime).to.equal("2021-04-20T00:10:00.000Z");
    expect(putResult1.menuId).to.equal("1");
    expect(putResult1.cancelled).to.equal(false);


    const getResult1 = await vendor.getDelivery(vendormail, usermail, "2021-04-20T00:10:00.000Z");
    expect(getResult1.vendorId).to.equal(vendormail)
    expect(getResult1.userId).to.equal(usermail);
    expect(getResult1.deliverytime.substr(0,10)).to.equal("2021-04-20");
    expect(getResult1.menuId).to.equal("1");
    expect(getResult1.cancelled).to.equal(false);

    const putResult2 = await vendor.putDelivery(vendormail, usermail, delivery2);
    expect(putResult2.menuId).to.equal("2");

    const putResult3 = await vendor.putDelivery(vendormail, usermail, delivery3);
    expect(putResult3.userId).to.equal(usermail)

    const putResult4 = await vendor.putDelivery(vendormail, usermail, delivery4);
    expect(putResult4.vendorId).to.equal(vendormail);
    expect(putResult4.userId).to.equal(usermail);

    await vendor.deleteDelivery(vendormail, usermail, "2021-05-01T00:10:00.000Z");
    await vendor.getDelivery(vendormail, usermail, "2021-05-01T00:10:00.000Z");

    let putRes = await vendor.putDelivery(vendormail, usermail, delivery3);
    expect(putRes.deliverytime.substr(0,10)).to.equal("2021-05-01");

    //Testing userDeliveries u/deliveries
    let getRes = await user.getAllUsersDeliveries("2021-04-01", "2021-04-30");
    expect(getRes.length).to.equal(2);
    expect(getRes[0].deliverytime.substr(0,10)).to.equal("2021-04-01");
    expect(getRes[1].deliverytime.substr(0,10)).to.equal("2021-04-20");
    let res1 = getRes.find(({ deliverytime }) => deliverytime === "2021-04-20T00:10:00.000Z");
    expect(res1.menuId).to.equal("1");
    let res2 = getRes.find(({ deliverytime }) => deliverytime === "2021-04-01T00:10:00.000Z");
    expect(res2.menuId).to.equal("2");

    let getRes2 = await user.getAllUsersDeliveries("2021-04-01T00:10:00.000Z", "2021-05-31T00:10:00.000Z");
    expect(getRes2.length).to.equal(4);

    //Testing vendorDeliveries v/deliveries
    const vDelgetResult = await vendor.getAllVendorsDeliveries("2021-04-01", "2021-04-30");
    expect(vDelgetResult.length).to.equal(2);
    let vres1 = vDelgetResult.find( ({deliverytime}) => deliverytime === "2021-04-01T00:10:00.000Z");
    expect(vres1.menuId).to.equal("2");
    let vres2 = vDelgetResult.find( ({deliverytime}) => deliverytime === "2021-04-20T00:10:00.000Z");
    expect(vres2.menuId).to.equal("1");

    let vdelputRes = await vendor.postNewDeliveries("2021-06-30T00:10:00.000Z", 3, usermail);
    expect(vdelputRes.length).to.equal(3);
    expect(vdelputRes[0].userId).to.equal(usermail);
    expect(vdelputRes[0].vendorId).to.equal(vendormail);
    expect(vdelputRes[0].deliverytime.substr(0,10)).to.equal("2021-07-06");
    expect(vdelputRes[1].deliverytime.substr(0,10)).to.equal("2021-07-07");
    expect(vdelputRes[2].deliverytime.substr(0,10)).to.equal("2021-07-13");
    expect(vdelputRes[0].menuId).to.equal("2");
    expect(vdelputRes[1].menuId).to.equal("3");
    expect(vdelputRes[2].menuId).to.equal("2");

  });
  afterEach(async function () {
    await vendor.logout();
    await user.logout();
  });
});