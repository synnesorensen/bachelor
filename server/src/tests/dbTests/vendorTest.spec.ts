require('dotenv').config();
import 'source-map-support/register';
import { putVendorInDb, getVendorFromDb, deleteVendorInDb } from '../../dbUtils';
import { expect } from 'chai';
import 'mocha';

describe('Vendor profile test', () => {
    it('Putting, getting and deleting a vendor', async () => {
        const vendor = {
            company: "Delikatessen",
            fullname: "Bakermester Harepus",
            address: "Hakkebakkeskogen",
            phone: "6688552",
            email: "harepus@skogen.no",
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

        const putResult = await putVendorInDb(vendor, "testVendorId11");
        expect(putResult.company).to.equal("Delikatessen");
        expect(putResult.fullname).to.equal("Bakermester Harepus");
        expect(putResult.address).to.equal("Hakkebakkeskogen");
        expect(putResult.phone).to.equal("6688552");
        expect(putResult.schedule[0].id).to.equal("1");
        expect(putResult.schedule[1].id).to.equal("2");

        const getResult = await getVendorFromDb("testVendorId11");
        expect(getResult.company).to.equal("Delikatessen");
        expect(getResult.fullname).to.equal("Bakermester Harepus");
        expect(getResult.address).to.equal("Hakkebakkeskogen");
        expect(getResult.phone).to.equal("6688552");
        expect(getResult.schedule[0].id).to.equal("1");
        expect(getResult.schedule[1].id).to.equal("2");

        await deleteVendorInDb("testVendorId11");
        const newResult = await getVendorFromDb("testVendorId11");
        expect(newResult).to.equal(undefined);
    });
});