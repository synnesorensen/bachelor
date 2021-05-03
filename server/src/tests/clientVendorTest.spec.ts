require('dotenv').config();
import 'source-map-support/register';
import api from '../../../clients/webclient/src/api/api';
import { Api } from '../../../clients/webclient/src/api/api';
import getAuth from '../../../clients/webclient/src/components/LoginDialog/auth'
import { testPass, testUser, testVend, testVendPass } from '../../../common/settings';
import { expect } from 'chai';
import 'mocha';

let user = null;
let vendor = null;

describe('Client vendor profile test', () => {
    before(async function () {
        user = new Api();
        vendor = new Api();

        await user.login(testUser, testPass);
        await vendor.login(testVend, testVendPass);
    });
    it('Putting, getting and deleting a vendor', async () => {
        const vendor = {
            company: "Delikatessen",
            fullname: "Bakermester Harepus",
            address: "Hakkebakkeskogen",
            phone: "6688552",
            email: "ingrid.elisabeth.hjelle+test98@gmail.com",
            isVendor: true,
            schedule: [
                {
                    "id": "1",
                    "day": "tuesday",
                    "time": "10",
                    "menu": "Veggie lunch"
                },
                {
                    "id": "2",
                    "day": "wednesday",
                    "time": "10",
                    "menu": "Fish lunch"
                }
            ]
        };

        const putResult = await api.putVendor(vendor, "ingrid.elisabeth.hjelle+test98@gmail.com");
        expect(putResult.company).to.equal("Delikatessen");
        expect(putResult.fullname).to.equal("Bakermester Harepus");
        expect(putResult.address).to.equal("Hakkebakkeskogen");
        expect(putResult.phone).to.equal("6688552");
        expect(putResult.schedule[0].id).to.equal("1");
        expect(putResult.schedule[1].id).to.equal("2");

        const getResult = await api.getVendor("ingrid.elisabeth.hjelle+test98@gmail.com");
        expect(getResult.company).to.equal("Delikatessen");
        expect(getResult.fullname).to.equal("Bakermester Harepus");
        expect(getResult.address).to.equal("Hakkebakkeskogen");
        expect(getResult.phone).to.equal("6688552");
        expect(getResult.schedule[0].id).to.equal("1");
        expect(getResult.schedule[1].id).to.equal("2");

        /*D
        await deleteVendor("testVendorId11");
        const newResult = await getVendor("testVendorId11");
        expect(newResult).to.equal(undefined); */
    }).timeout(5000);
    after(async function () {
        await user.logout();
        await vendor.logout();
        console.log("logged out")
    });
});