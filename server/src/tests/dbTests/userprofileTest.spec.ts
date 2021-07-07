require('dotenv').config();
import 'source-map-support/register';
import { deleteUserprofileInDb, getUserprofileFromDb, putUserprofileInDb } from '../../dbUtils';
import { expect } from 'chai';
import 'mocha';

describe('User profile test', () => {
    it('Putting, getting and deleting a userprofile', async () => {
        let userprofile = {
            fullname: "Navn",
            address: "Skogen",
            deliveryAddress: "Havet",
            phone: "12345",
            email: "hallo@post.no",
            allergies: ["melk"],
            isVendor: false
        };

        const putResult = await putUserprofileInDb(userprofile, "testUserId44");
        expect(putResult.fullname).to.equal("Navn");
        expect(putResult.address).to.equal("Skogen");
        expect(putResult.deliveryAddress).to.equal("havet");
        expect(putResult.phone).to.equal("12345");
        expect(putResult.email).to.equal("hallo@post.no");
        expect(putResult.allergies).to.eql(["melk"]);

        const getResult = await getUserprofileFromDb("testUserId44");
        expect(getResult.fullname).to.equal("Navn");
        expect(getResult.address).to.equal("Skogen");
        expect(getResult.phone).to.equal("12345");
        expect(getResult.email).to.equal("hallo@post.no");

        expect(getResult.allergies).to.eql(["melk"]);

        await deleteUserprofileInDb("testUserId44");
        const newResult = await getUserprofileFromDb("testUserId44");
        expect(newResult).to.equal(undefined);
    });
});



