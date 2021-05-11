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
describe('Vendor role http test', function () {
    mocha_1.beforeEach(async function () {
        vendor = new api_1.Api();
        await vendor.login(settings_1.testVend, settings_1.testVendPass);
    });
    it('Checking vendor role', async () => {
        let vendorprofile = await vendor.getUserprofile();
        chai_1.expect(vendorprofile.isVendor).equal(true);
    });
    mocha_1.afterEach(async function () {
        await vendor.logout();
    });
});
//# sourceMappingURL=vendorRole.test.js.map