require('dotenv').config();
import 'source-map-support/register';
import { putVendorInDb, getVendorFromDb, deleteVendorInDb } from '../dbUtils';
import { expect } from 'chai';
import 'mocha';

describe('Vendor profile test', () => {
    it('Putting, getting and deleting a vendor', async () => {
        let vendor = {
            company: "Delikatessen",
            fullname: "Bakermester Harepus",
            address: "Hakkebakkeskogen",
            phone: "6688552",
            email: "harepus@skogen.no",
            schedule: ["5", "6", "7"]
        };

        const putResult = await putVendorInDb(vendor, "testVendorId11");
        expect(putResult.company).to.equal("Delikatessen");
        expect(putResult.fullname).to.equal("Bakermester Harepus");
        expect(putResult.address).to.equal("Hakkebakkeskogen");
        expect(putResult.phone).to.equal("6688552");
        expect(putResult.schedule).to.eql(["5", "6", "7"]);

        const getResult = await getVendorFromDb("testVendorId11");
        expect(getResult.company).to.equal("Delikatessen");
        expect(getResult.fullname).to.equal("Bakermester Harepus");
        expect(getResult.address).to.equal("Hakkebakkeskogen");
        expect(getResult.phone).to.equal("6688552");
        expect(getResult.schedule).to.eql(["5", "6", "7"]);

        await deleteVendorInDb("testVendorId11");
        const newResult = await getVendorFromDb("testVendorId11");
        expect(newResult).to.equal(undefined);
    });
});