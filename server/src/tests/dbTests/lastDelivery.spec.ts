require('dotenv').config();
import 'source-map-support/register';
import { deleteDeliveryInDb, findLatestDelivery, putDeliveryInDb } from '../../dbUtils';
import { expect } from 'chai';
import 'mocha';

describe('Last delivery', () => {
  const paid: "paid" | "unpaid" = "unpaid";
  const approved: "new" | "approved" | "denied" = "new";

  it('finds the latest delivery for a user', async () => {
    const noDelivery = await findLatestDelivery("testVendorId66", "testUserId16");
    expect(noDelivery).equal(null);

    const deliveryType: "sub" | "single" = "sub"

    let delivery1 = {
      vendorId: "testVendorId66",
      userId: "testUserId16",
      deliverytime: "2021-04-20",
      menuId: "1", 
      cancelled: false,
      deliveryType,
      paid,
      approved,
      noOfMeals: 1
    };

    const res1 = await putDeliveryInDb("testVendorId66", "testUserId16", delivery1);
    expect(res1.deliverytime).equal("2021-04-20");

    let delivery2 = {
      vendorId: "testVendorId66",
      userId: "testUserId16",
      deliverytime: "2021-04-21",
      menuId: "1", 
      deliveryType,
      cancelled: false,
      paid,
      approved,
      noOfMeals: 1
    };

    const res2 = await putDeliveryInDb("testVendorId66", "testUserId16", delivery2);
    expect(res2.deliverytime).equal("2021-04-21");

    await deleteDeliveryInDb("testUserId16","2021-04-20");
    await deleteDeliveryInDb("testUserId16","2021-04-21");
  });
});
