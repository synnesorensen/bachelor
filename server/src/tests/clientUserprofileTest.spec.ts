require('dotenv').config();
import 'source-map-support/register';
import { deleteUserprofile, getUserprofile, putUserprofile } from '../../../clients/webclient/src/api/api';
import getAuth from '../../../clients/webclient/src/components/LoginDialog/auth'
import { expect } from 'chai';
import 'mocha';

describe('Client user profile test', () => {
    it('userProfile client check', async () => {
        const auth = getAuth();
        let username = "ingrid.elisabeth.hjelle+test20@gmail.com";
        let password = "qwerty123";
        let signedInUser = await auth.signIn(username, password);

        let userprofile = {
            fullname: "Navn",
            address: "Skogen",
            phone: "12345678",
            email: "ingrid.elisabeth.hjelle+test20@gmail.com",
            allergies: ["melk"],
            isVendor: false
        };

        let putRes = await putUserprofile(userprofile);
        expect(putRes.fullname).to.equal("Navn");
        expect(putRes.address).to.equal("Skogen");
        expect(putRes.phone).to.equal("12345678");
        expect(putRes.email).to.equal("ingrid.elisabeth.hjelle+test20@gmail.com");
        expect(putRes.allergies[0]).to.equal("melk");
        expect(putRes.isVendor).to.equal(false);

        let getRes = await getUserprofile()
        expect(getRes.fullname).to.eql("Navn");
        expect(putRes.address).to.equal("Skogen");
        expect(putRes.phone).to.equal("12345678");
        expect(putRes.email).to.equal("ingrid.elisabeth.hjelle+test20@gmail.com");
        expect(putRes.allergies[0]).to.equal("melk");
        expect(putRes.isVendor).to.equal(false);

        //let delRes = await deleteUserprofile();
        //let newRes = await getUserprofile();
        //expect(newRes).to.equal(null);
    });
  });


