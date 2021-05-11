"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
require("source-map-support/register");
const api_1 = require("../../../../clients/webclient/src/api/api");
const settings_1 = require("../../../../common/settings");
const chai_1 = require("chai");
require("mocha");
const mocha_1 = require("mocha");
let user = null;
const mail = settings_1.testVend;
describe('Userprofile for vendor http test', () => {
    mocha_1.beforeEach(async function () {
        user = new api_1.Api();
        await user.login(settings_1.testVend, settings_1.testVendPass);
    });
    it('userProfile vendor check, get and put', async () => {
        let userprofile = {
            fullname: "Ing Ping",
            address: "Hjemme",
            phone: "98765432",
            email: mail,
            allergies: ["melk"],
            isVendor: true
        };
        let putRes = await user.putUserprofile(userprofile);
        chai_1.expect(putRes.fullname).to.equal("Ing Ping");
        chai_1.expect(putRes.address).to.equal("Hjemme");
        chai_1.expect(putRes.phone).to.equal("98765432");
        chai_1.expect(putRes.email).to.equal(mail);
        chai_1.expect(putRes.allergies[0]).to.equal("melk");
        chai_1.expect(putRes.isVendor).to.equal(true);
        chai_1.expect(putRes.isVendor).to.not.equal(false);
        let getRes = await user.getUserprofile();
        chai_1.expect(getRes.fullname).to.equal("Ing Ping");
        chai_1.expect(getRes.fullname).to.not.equal("Johnny");
        chai_1.expect(getRes.address).to.equal("Hjemme");
        chai_1.expect(getRes.phone).to.equal("98765432");
        chai_1.expect(getRes.email).to.equal(mail);
        chai_1.expect(getRes.allergies[0]).to.equal("melk");
        chai_1.expect(getRes.allergies.length).to.equal(1);
        chai_1.expect(getRes.isVendor).to.equal(true);
    });
    mocha_1.afterEach(async function () {
        await user.logout();
    });
});
//# sourceMappingURL=userProfileVendor.test.js.map