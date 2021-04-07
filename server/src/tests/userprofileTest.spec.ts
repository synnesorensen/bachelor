require('dotenv').config();
import 'source-map-support/register';
import { deleteUserprofileInDb, getUserprofileFromDb, putUserprofileInDb } from '../dbUtils';
import { expect } from 'chai';
import 'mocha';

describe('User profile test', () => {
    it('Putting, getting and deleting a userprofile', async () => {
        let userprofile = {
            fullname: "Navn",
            address: "Skogen",
            phone: "12345",
            email: "hallo@post.no"
        };

        const putResult = await putUserprofileInDb(userprofile, "testUserId");
        expect(putResult.fullname).to.equal("Navn");
        expect(putResult.address).to.equal("Skogen");
        expect(putResult.phone).to.equal("12345");
        expect(putResult.email).to.equal("hallo@post.no");

        const getResult = await getUserprofileFromDb("testUserId");
        expect(getResult.fullname).to.equal("Navn");
        expect(getResult.address).to.equal("Skogen");
        expect(getResult.phone).to.equal("12345");
        expect(getResult.email).to.equal("hallo@post.no");

        await deleteUserprofileInDb("testUserId");
        const newResult = await getUserprofileFromDb("testUserId");
        expect(newResult).to.equal(undefined);
    });
});



