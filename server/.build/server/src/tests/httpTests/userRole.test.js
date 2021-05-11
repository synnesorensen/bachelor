"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
require("source-map-support/register");
const api_1 = require("../../../../clients/webclient/src/api/api");
const settings_1 = require("../../../../common/settings");
const chai_1 = require("chai");
require("mocha");
let user = null;
describe('User role http test', function () {
    before(async function () {
        user = new api_1.Api();
        await user.login(settings_1.testUser, settings_1.testPass);
    });
    it('Checking user and vendor roles', async () => {
        let userprofile = await user.getUserprofile();
        chai_1.expect(userprofile.isVendor).equal(false);
    });
    after(async function () {
        await user.logout();
    });
});
//# sourceMappingURL=userRole.test.js.map