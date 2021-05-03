require('dotenv').config();
import 'source-map-support/register';
import { deleteUserprofile, getUserprofile, putUserprofile } from '../../../clients/webclient/src/api/api';
import getAuth from '../../../clients/webclient/src/components/LoginDialog/auth';
import { testUser, testPass} from '../../../common/settings';
import { expect } from 'chai';
import 'mocha';

describe('Client user profile test', () => {
    it('userProfile client check', async () => {
        const auth = getAuth();
        let username = testUser;
        let password = testPass;
        let signedInUser = await auth.signIn(username, password);

        let userprofile = {
            fullname: "Navn",
            address: "Skogen",
            phone: "12345678",
            email: "ingrid.elisabeth.hjelle+test98@gmail.com",
            allergies: ["melk"],
            isVendor: false
        };

        let putRes = await putUserprofile(userprofile);
        expect(putRes.fullname).to.equal("Navn");
        expect(putRes.address).to.equal("Skogen");
        expect(putRes.phone).to.equal("12345678");
        expect(putRes.email).to.equal("ingrid.elisabeth.hjelle+test98@gmail.com");
        expect(putRes.allergies[0]).to.equal("melk");
        expect(putRes.isVendor).to.equal(false);

        let getRes = await getUserprofile()
        expect(getRes.fullname).to.eql("Navn");
        expect(putRes.address).to.equal("Skogen");
        expect(putRes.phone).to.equal("12345678");
        expect(putRes.email).to.equal("ingrid.elisabeth.hjelle+test98@gmail.com");
        expect(putRes.allergies[0]).to.equal("melk");
        expect(putRes.isVendor).to.equal(false);

        
        //Dette fungerer, men sletter profilen på ordentlig
        /*let delRes = await deleteUserprofile();
        let newRes = await getUserprofile();
        expect(newRes).to.equal(null);*/
    }).timeout(5000);
  });


