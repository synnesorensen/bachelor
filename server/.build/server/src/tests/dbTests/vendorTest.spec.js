"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
require("source-map-support/register");
const dbUtils_1 = require("../../dbUtils");
const chai_1 = require("chai");
require("mocha");
describe('Vendor profile test', () => {
    it('Putting, getting and deleting a vendor', async () => {
        const vendor = {
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
        const putResult = await dbUtils_1.putVendorInDb(vendor, "testVendorId11");
        chai_1.expect(putResult.company).to.equal("Delikatessen");
        chai_1.expect(putResult.fullname).to.equal("Bakermester Harepus");
        chai_1.expect(putResult.address).to.equal("Hakkebakkeskogen");
        chai_1.expect(putResult.phone).to.equal("6688552");
        chai_1.expect(putResult.schedule[0].id).to.equal("1");
        chai_1.expect(putResult.schedule[1].id).to.equal("2");
        const getResult = await dbUtils_1.getVendorFromDb("testVendorId11");
        chai_1.expect(getResult.company).to.equal("Delikatessen");
        chai_1.expect(getResult.fullname).to.equal("Bakermester Harepus");
        chai_1.expect(getResult.address).to.equal("Hakkebakkeskogen");
        chai_1.expect(getResult.phone).to.equal("6688552");
        chai_1.expect(getResult.schedule[0].id).to.equal("1");
        chai_1.expect(getResult.schedule[1].id).to.equal("2");
        await dbUtils_1.deleteVendorInDb("testVendorId11");
        const newResult = await dbUtils_1.getVendorFromDb("testVendorId11");
        chai_1.expect(newResult).to.equal(undefined);
    });
});
//# sourceMappingURL=vendorTest.spec.js.map