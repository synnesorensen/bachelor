"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
require("source-map-support/register");
const dbUtils_1 = require("../../dbUtils");
const chai_1 = require("chai");
require("mocha");
describe('Last delivery', () => {
    it('finds the latest delivery for a user', async () => {
        const noDelivery = await dbUtils_1.findLatestDelivery("testVendorId66", "testUserId16");
        chai_1.expect(noDelivery).equal(null);
        let delivery1 = {
            vendorId: "testVendorId66",
            userId: "testUserId16",
            deliverytime: "2021-04-20",
            menuId: "1",
            cancelled: false
        };
        const res1 = await dbUtils_1.putDeliveryInDb("testVendorId66", "testUserId16", delivery1);
        chai_1.expect(res1.deliverytime).equal("2021-04-20");
        let delivery2 = {
            vendorId: "testVendorId66",
            userId: "testUserId16",
            deliverytime: "2021-04-21",
            menuId: "1",
            cancelled: false
        };
        const res2 = await dbUtils_1.putDeliveryInDb("testVendorId66", "testUserId16", delivery2);
        chai_1.expect(res2.deliverytime).equal("2021-04-21");
        await dbUtils_1.deleteDeliveryInDb("testVendorId66", "testUserId16", "2021-04-20");
        await dbUtils_1.deleteDeliveryInDb("testVendorId66", "testUserId16", "2021-04-21");
    });
});
//# sourceMappingURL=lastDelivery.spec.js.map