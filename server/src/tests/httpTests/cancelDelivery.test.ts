require('dotenv').config();
import 'source-map-support/register';
import { Api } from '../../../../clients/webclient/src/api/api';
import { expect } from 'chai';
import { testPass, testUser, testVend, testVendPass} from '../../../../common/settings';
import 'mocha';
import { afterEach, beforeEach } from 'mocha';
import { Delivery } from '../../../../common/interfaces';

let userApi = null; 
let vendorApi = null;
let usermail = testUser;
let vendormail = testVend;

describe('Subscription vendor http test', () => {
    beforeEach(async function () {
        vendorApi = new Api();
        userApi = new Api();
        await userApi.login(testUser, testPass);
        await vendorApi.login(testVend, testVendPass);
    });

    it('Putting, getting and deleting a subscription', async () => {
        const sub = {
            vendorId: vendormail,
            userId: usermail,
            approved: false,
            paused: true,
            schedule: ["2", "3"], 
            noOfMeals: 1,
            box: "engangsboks"
        };
        const vendor = {
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
        let userprofile = {
            fullname: "Admin Adminsen",
            address: "Hjemme",
            phone: "98765432",
            email: vendormail,
            allergies: ["melk"],
            isVendor: true
        };
        await vendorApi.putUserprofile(userprofile);
        await vendorApi.putVendor(vendor, vendormail);
        await userApi.putUserSubscription(sub);
        
        let deliveries = await vendorApi.postNewDeliveries("2021-06-01T00:00:00.000Z", 8, usermail);
        expect(deliveries.length).equal(8);
        let addedDeliveries = await userApi.getAllUsersDeliveries("2021-06-01T00:00:00.000Z", "2021-06-30T23:59:00.000Z");
        expect(addedDeliveries.length).equal(8);

        let cancelledDeliveries: Delivery[] = [];
        cancelledDeliveries.push(deliveries[0]);
        await userApi.cancelDeliveries(cancelledDeliveries);
        let getDel1 = await userApi.getAllUsersDeliveries("2021-06-01T00:00:00.000Z", "2021-06-30T23:59:00.000Z");

        // Expect to return the same amount of deliveries as the cancelled one has been moved to end of period:
        expect(getDel1.length).equal(9);
        expect(getDel1[0].cancelled).equal(true);
        expect(getDel1[getDel1.length-1].deliverytime).equal("2021-06-29T00:00:00.010Z");

        let allDeliveries = await userApi.getAllUsersDeliveries("2021-06-01T00:00:00.000Z", "2021-06-30T23:59:00.000Z");
        let promises: Promise<void>[] = [];
        for (let del of allDeliveries) {
            promises.push(vendorApi.deleteDelivery(del.vendorId, del.userId, del.deliverytime));
        }
        promises.push(userApi.deleteUserSubscription(vendormail));
        promises.push(vendorApi.deleteUserprofile());
        promises.push(vendorApi.deleteVendor(vendormail));
        await Promise.all(promises);
    });

    afterEach(async function () {
        await vendorApi.logout();
        await userApi.logout();
    });
}); 