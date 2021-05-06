require('dotenv').config();
import 'source-map-support/register';
import { Api } from '../../../../clients/webclient/src/api/api';
import { testUser, testPass, testVend, testVendPass } from '../../../../common/settings';
import { expect } from 'chai';
import 'mocha';
import { afterEach, beforeEach } from 'mocha';

let vendor = null;
let user = null;

describe('User deliveries test', () => {
    beforeEach(async function () {
        vendor = new Api();
        user = new Api();
        await vendor.login(testVend, testVendPass);
        await user.login(testUser, testPass);

    });
    it('Get user deliveries', async () => {
        let getRes = await user.getAllUsersDeliveries("2021-04-01", "2021-04-30");
        expect(getRes.length).to.equal(2);
        expect(getRes[0].deliverytime).to.equal("2021-04-01");
        expect(getRes[1].deliverytime).to.equal("2021-04-20");
        let res1 = getRes.find(({ deliverytime }) => deliverytime === "2021-04-20");
        expect(res1.menuId).to.equal("1");
        let res2 = getRes.find(({ deliverytime }) => deliverytime === "2021-04-01");
        expect(res2.menuId).to.equal("2");

        let getRes2 = await user.getAllUsersDeliveries("2021-04-01", "2021-05-31");
        expect(getRes2.length).to.equal(4);

    }).timeout(5000);
    afterEach(async function () {
        await vendor.logout();
        await user.logout();
    });
});