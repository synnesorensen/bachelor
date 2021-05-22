require('dotenv').config();
import 'source-map-support/register';
import { Api } from '../../../../clients/webclient/src/api/api';
import { expect } from 'chai';
import { testPass, testUser, testVend, testVendPass} from '../../../../common/settings';
import 'mocha';
import { afterEach, beforeEach } from 'mocha';
import { Action } from 'src/interfaces';

let user = null; 
let vendor = null;
let usermail = testUser;
let vendormail = testVend;

describe('Subscription vendor http test', () => {
    beforeEach(async function () {
        vendor = new Api();
        user = new Api();
        await user.login(testUser, testPass);
        await vendor.login(testVend, testVendPass);
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
        let userprofile = {
            fullname: "Admin Adminsen",
            address: "Hjemme",
            phone: "98765432",
            email: vendormail,
            allergies: ["melk"],
            isVendor: true
        };
        await vendor.putUserprofile(userprofile);
        await vendor.putVendor(vendorProfile, vendormail);
        await user.putUserSubscription(sub);
        let deliveries = await vendor.postNewDeliveries("2021-06-01T00:10:00.000Z", 8, usermail);
        expect(deliveries.length).equal(8);
        await user.getAllUsersDeliveries("2021-06-01T00:10:00.000Z", "2021-06-30T00:10:00.000Z");

        let action1: Action = {
            action: "pause",
            time: "2021-06-09T00:10:00.000Z"
        }
        await user.postSubscription(vendormail, action1);
        let getDel1 = await user.getAllUsersDeliveries("2021-06-01T00:10:00.000Z", "2021-06-30T00:10:00.000Z");
        
        // Expect to only return deliveries that has a date before the date of pausing subscription:
        expect(getDel1.length).equal(3);

        let action2: Action = {
            action: "unpause",
            time: "2021-06-16T00:10:00.000Z"
        }
        await user.postSubscription(vendormail, action2);
        let getDel2 = await user.getAllUsersDeliveries("2021-06-16T00:10:00.000Z", "2021-07-30T00:10:00.000Z");
        
        // Expect to return no of deliveries that was left in period when pausing the subscription:
        expect(getDel2.length).equal(5);

        await vendor.deleteDelivery(vendormail, usermail, "2021-06-22T00:10:00.000Z");
        await vendor.deleteDelivery(vendormail, usermail, "2021-06-23T00:10:00.000Z");
        await vendor.deleteDelivery(vendormail, usermail, "2021-06-29T00:10:00.000Z");
        await vendor.deleteDelivery(vendormail, usermail, "2021-06-30T00:10:00.000Z");
        await vendor.deleteDelivery(vendormail, usermail, "2021-06-22T00:10:00.000Z")
        await vendor.deleteDelivery(vendormail, usermail, "2021-07-06T00:10:00.000Z");
        await vendor.deleteUserSubscription(vendormail);
        await vendor.deleteUserprofile();
        await vendor.deleteVendor(vendormail);
        await vendor.deleteUserprofile();
    });
    
    afterEach(async function () {
        await vendor.logout();
        await user.logout();
    });
});