require('dotenv').config();
import 'source-map-support/register';
import { Api } from '../../../clients/webclient/src/api/api';
import api from '../../../clients/webclient/src/api/api';
import { testUser, testPass, testVend, testVendPass} from '../../../common/settings';
import { expect } from 'chai';
import 'mocha';

let user = null;
let vendor = null;

describe('Client user profile test', () => {
    before(async function () {
        user = new Api();
        vendor = new Api();

        await user.login(testUser, testPass);
        await vendor.login(testVend, testVendPass);
    });
    it('userProfile client check', async () => {
        let userprofile = {
            fullname: "Navn",
            address: "Skogen",
            phone: "12345678",
            email: "ingrid.elisabeth.hjelle+test15@gmail.com",
            allergies: ["melk"],
            isVendor: false
        };

        let putRes = await api.putUserprofile(userprofile);
        expect(putRes.fullname).to.equal("Navn");
        expect(putRes.address).to.equal("Skogen");
        expect(putRes.phone).to.equal("12345678");
        expect(putRes.email).to.equal("ingrid.elisabeth.hjelle+test15@gmail.com");
        expect(putRes.allergies[0]).to.equal("melk");
        expect(putRes.isVendor).to.equal(false);

        let getRes = await api.getUserprofile()
        expect(getRes.fullname).to.eql("Navn");
        expect(putRes.address).to.equal("Skogen");
        expect(putRes.phone).to.equal("12345678");
        expect(putRes.email).to.equal("ingrid.elisabeth.hjelle+test15@gmail.com");
        expect(putRes.allergies[0]).to.equal("melk");
        expect(putRes.isVendor).to.equal(false);

        
        //Dette fungerer, men sletter profilen på ordentlig
        /*let delRes = await deleteUserprofile();
        let newRes = await getUserprofile();
        expect(newRes).to.equal(null);*/
    }).timeout(5000);
    after(async function () {
        await user.logout();
        await vendor.logout();
        console.log("logged out")
    });
  });


