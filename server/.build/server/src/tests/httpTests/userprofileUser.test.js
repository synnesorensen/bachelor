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
let mail = settings_1.testUser;
describe('Userprofile for user http test', () => {
    mocha_1.beforeEach(async function () {
        user = new api_1.Api();
        await user.login(settings_1.testUser, settings_1.testPass);
    });
    it('userProfile user check, put, get and delete', async () => {
        let userprofile = {
            fullname: "Hjørdis",
            address: "Skogen",
            phone: "12345678",
            email: mail,
            allergies: ["melk"],
            isVendor: false
        };
        let putRes = await user.putUserprofile(userprofile);
        chai_1.expect(putRes.fullname).to.equal("Hjørdis");
        chai_1.expect(putRes.address).to.equal("Skogen");
        chai_1.expect(putRes.phone).to.equal("12345678");
        chai_1.expect(putRes.email).to.equal(mail);
        chai_1.expect(putRes.allergies[0]).to.equal("melk");
        chai_1.expect(putRes.isVendor).to.equal(false);
        let getRes = await user.getUserprofile();
        chai_1.expect(getRes.fullname).to.eql("Hjørdis");
        chai_1.expect(getRes.fullname).to.not.equal("Trude");
        chai_1.expect(getRes.address).to.equal("Skogen");
        chai_1.expect(getRes.phone).to.equal("12345678");
        chai_1.expect(getRes.email).to.equal(mail);
        chai_1.expect(getRes.allergies[0]).to.equal("melk");
        chai_1.expect(getRes.allergies).to.not.equal("sennep");
        chai_1.expect(getRes.isVendor).to.equal(false);
        await user.deleteUserprofile();
        let newRes = await user.getUserprofile();
        chai_1.expect(newRes).to.equal(null);
        await user.putUserprofile(userprofile);
    });
    mocha_1.afterEach(async function () {
        await user.logout();
    });
});
//# sourceMappingURL=userprofileUser.test.js.map