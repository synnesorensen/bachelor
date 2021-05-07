require('dotenv').config();
import 'source-map-support/register';
import { Api } from '../../../../clients/webclient/src/api/api';
import { testVend, testVendPass } from '../../../../common/settings';
import { expect } from 'chai';
import 'mocha';
import { afterEach, beforeEach } from 'mocha';

let vendor = null;
describe('Testing vendor role', function () {
    beforeEach(async function () {
        vendor = new Api();
        await vendor.login(testVend, testVendPass);
    });
    it('Checking vendor role', async () => {

        let vendorprofile = await vendor.getUserprofile();
        expect(vendorprofile.isVendor).equal(true);

    });
    afterEach(async function () {
        await vendor.logout();
    });

});