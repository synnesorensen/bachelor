"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
require('dotenv').config();
require("source-map-support/register");
const dbUtils_1 = require("../../dbUtils");
const chai_1 = require("chai");
require("mocha");
describe('User profile test', () => {
    it('Putting, getting and deleting a userprofile', async () => {
        let userprofile = {
            fullname: "Navn",
            address: "Skogen",
            phone: "12345",
            email: "hallo@post.no",
            allergies: ["melk"],
            isVendor: false
        };
        const putResult = await dbUtils_1.putUserprofileInDb(userprofile, "testUserId44");
        chai_1.expect(putResult.fullname).to.equal("Navn");
        chai_1.expect(putResult.address).to.equal("Skogen");
        chai_1.expect(putResult.phone).to.equal("12345");
        chai_1.expect(putResult.email).to.equal("hallo@post.no");
        chai_1.expect(putResult.allergies).to.eql(["melk"]);
        const getResult = await dbUtils_1.getUserprofileFromDb("testUserId44");
        chai_1.expect(getResult.fullname).to.equal("Navn");
        chai_1.expect(getResult.address).to.equal("Skogen");
        chai_1.expect(getResult.phone).to.equal("12345");
        chai_1.expect(getResult.email).to.equal("hallo@post.no");
        chai_1.expect(getResult.allergies).to.eql(["melk"]);
        await dbUtils_1.deleteUserprofileInDb("testUserId44");
        const newResult = await dbUtils_1.getUserprofileFromDb("testUserId44");
        chai_1.expect(newResult).to.equal(undefined);
    });
});
//# sourceMappingURL=userprofileTest.spec.js.map