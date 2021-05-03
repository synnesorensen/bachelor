require('dotenv').config();
import 'source-map-support/register';
import { Api } from '../../../clients/webclient/src/api/api';
import { testPass, testUser, testVend, testVendPass } from '../../../common/settings';
import { expect } from 'chai';
import 'mocha';

let user = null;
let vendor = null;
describe('Testing user and vendor profile', function () {
    before(async function () {
        user = new Api();
        vendor = new Api();

        await user.login(testUser, testPass);
        await vendor.login(testVend, testVendPass);
    });
    it('Checking user and vendor roles', async () => {
        let userprofile = await user.getUserprofile();
        let vendorprofile = await vendor.getUserprofile();
        expect(userprofile.isVendor).equal(false);
        expect(vendorprofile.isVendor).equal(true);


    }).timeout(5000);
    after(async function () {
        await user.logout();
        await vendor.logout();
        console.log("logged out")
    });

});