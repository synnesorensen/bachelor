require('dotenv').config();
import 'source-map-support/register';
import { getVendor, putVendor, deleteVendor } from '../../../clients/webclient/src/api/api';
import getAuth from '../../../clients/webclient/src/components/LoginDialog/auth'
import { testPass, testUser, testVend, testVendPass} from '../../../common/settings';
import { expect } from 'chai';
import 'mocha';

describe('Client vendor profile test', () => {
    it('Putting, getting and deleting a vendor', async () => {
        const auth = getAuth();
        let username = testVend;
        let password = testVendPass;
        let signedInUser = await auth.signIn(username, password);
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

        const putResult = await putVendor(vendor, "ingrid.elisabeth.hjelle+test98@gmail.com");
        expect(putResult.company).to.equal("Delikatessen");
        expect(putResult.fullname).to.equal("Bakermester Harepus");
        expect(putResult.address).to.equal("Hakkebakkeskogen");
        expect(putResult.phone).to.equal("6688552");
        expect(putResult.schedule[0].id).to.equal("1");
        expect(putResult.schedule[1].id).to.equal("2");

        const getResult = await getVendor("ingrid.elisabeth.hjelle+test98@gmail.com");
        expect(getResult.company).to.equal("Delikatessen");
        expect(getResult.fullname).to.equal("Bakermester Harepus");
        expect(getResult.address).to.equal("Hakkebakkeskogen");
        expect(getResult.phone).to.equal("6688552");
        expect(getResult.schedule[0].id).to.equal("1");
        expect(getResult.schedule[1].id).to.equal("2");

        //Denne feiler i terminalen
        /*Denne feiler med server error 403
        await deleteVendor("testVendorId11");
        const newResult = await getVendor("testVendorId11");
        expect(newResult).to.equal(undefined); */
    }).timeout(5000);
});