"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
require("source-map-support/register");
const api_1 = require("../../../../clients/webclient/src/api/api");
const settings_1 = require("../../../../common/settings");
const chai_1 = require("chai");
require("mocha");
const mocha_1 = require("mocha");
let vendor = null;
let vendormail = settings_1.testVend;
describe('Vendor http test', () => {
    mocha_1.beforeEach(async function () {
        vendor = new api_1.Api();
        await vendor.logout();
        await vendor.login(settings_1.testVend, settings_1.testVendPass);
    });
    it('Putting, getting and deleting a vendor', async () => {
        const vendorProfile = {
            company: "Delikatessen",
            fullname: "Bakermester Harepus",
            address: "Hakkebakkeskogen",
            phone: "6688552",
            email: "ingrid.elisabeth.hjelle+test97@gmail.com",
            isVendor: true,
            schedule: [
                {
                    "id": "2",
                    "day": "Tirsdag",
                    "time": "10",
                    "menu": "Veggie lunch"
                },
                {
                    "id": "3",
                    "day": "Onsdag",
                    "time": "10",
                    "menu": "Fish lunch"
                }
            ]
        };
        const putResult = await vendor.putVendor(vendorProfile, vendormail);
        chai_1.expect(putResult.company).to.equal("Delikatessen");
        chai_1.expect(putResult.fullname).to.equal("Bakermester Harepus");
        chai_1.expect(putResult.address).to.equal("Hakkebakkeskogen");
        chai_1.expect(putResult.phone).to.equal("6688552");
        chai_1.expect(putResult.schedule[0].id).to.equal("2");
        chai_1.expect(putResult.schedule[1].id).to.equal("3");
        const getResult = await vendor.getVendor(vendormail);
        chai_1.expect(getResult.company).to.equal("Delikatessen");
        chai_1.expect(getResult.fullname).to.equal("Bakermester Harepus");
        chai_1.expect(getResult.address).to.equal("Hakkebakkeskogen");
        chai_1.expect(getResult.phone).to.equal("6688552");
        chai_1.expect(getResult.schedule[0].id).to.equal("2");
        chai_1.expect(getResult.schedule[1].id).to.equal("3");
    });
    mocha_1.afterEach(async function () {
        await vendor.logout();
    });
});
//# sourceMappingURL=vendor.test.js.map