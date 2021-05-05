require('dotenv').config();
import 'source-map-support/register';
import { Api } from '../../../../clients/webclient/src/api/api';
import { testUser, testPass } from '../../../../common/settings';
import { expect } from 'chai';
import 'mocha';
import { afterEach, beforeEach } from 'mocha';

let user = null;

describe('Testing user role', function () {
    beforeEach(async function () {
        user = new Api();
        await user.login(testUser, testPass);
    });
    it('Checking user and vendor roles', async () => {

        let userprofile = await user.getUserprofile();
        expect(userprofile.isVendor).equal(false);

    }).timeout(5000);
    afterEach(async function () {
        await user.logout();
    });

});