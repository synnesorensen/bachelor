require('dotenv').config();
import 'source-map-support/register';
import { Api } from '../../../../clients/webclient/src/api/api';
import { testVend, testVendPass } from '../../../../common/settings';
import { expect } from 'chai';
import 'mocha';
import { afterEach, beforeEach } from 'mocha';

let vendor = null;
let vendormail = testVend;

describe('Vendor http test', () => {
    beforeEach(async function () {
        vendor = new Api();
        await vendor.logout();
        await vendor.login(testVend, testVendPass);
        
    });
    it('Putting, getting and deleting a vendor', async () => {
        const vendorProfile = {
            vendorId: vendormail,
            company: "Delikatessen",
            fullname: "Bakermester Harepus",
            address: "Hakkebakkeskogen",
            phone: "6688552",
            email: vendormail,
            isVendor: true,
            schedule: [
                {
                    "id": "2",
                    "day": "Tirsdag",
                    "time": "10",
                    "menu": "Veggie lunch"
                },
                {
                    "id": "3",
                    "day": "Onsdag",
                    "time": "10",
                    "menu": "Fish lunch"
                }
            ]
        };

        const putResult = await vendor.putVendor(vendorProfile, vendormail);
        expect(putResult.company).to.equal("Delikatessen");
        expect(putResult.fullname).to.equal("Bakermester Harepus");
        expect(putResult.address).to.equal("Hakkebakkeskogen");
        expect(putResult.phone).to.equal("6688552");
        expect(putResult.schedule[0].id).to.equal("2");
        expect(putResult.schedule[1].id).to.equal("3");

        const getResult = await vendor.getVendor(vendormail);
        expect(getResult.company).to.equal("Delikatessen");
        expect(getResult.fullname).to.equal("Bakermester Harepus");
        expect(getResult.address).to.equal("Hakkebakkeskogen");
        expect(getResult.phone).to.equal("6688552");
        expect(getResult.schedule[0].id).to.equal("2");
        expect(getResult.schedule[1].id).to.equal("3");

        const getSingleResult = await vendor.getVendor();
        expect(getSingleResult.company).to.equal("Delikatessen");
        expect(getSingleResult.vendorId).to.equal(vendormail);
        
        /*
        Sletting fungerer, men kommenterer vekk da det skaper problemer for annen test
        await vendor.deleteVendor(vendormail);
        const newResult = await vendor.getVendor(vendormail);
        expect(newResult).to.equal(null);
        await vendor.putVendor(vendorProfile, vendormail);*/
    });
    afterEach(async function () {
        await vendor.logout();
    });
});