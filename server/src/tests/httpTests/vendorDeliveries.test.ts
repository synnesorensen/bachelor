require('dotenv').config();
import 'source-map-support/register';
import { Api } from '../../../../clients/webclient/src/api/api';
import { testUser, testPass, testVend, testVendPass } from '../../../../common/settings';
import { expect } from 'chai';
import 'mocha';
import { afterEach, beforeEach } from 'mocha';

let vendor = null;
let user = null
const vendormail = "ingrid.elisabeth.hjelle+test97@gmail.com";
const usermail = "ingrid.elisabeth.hjelle+test50@gmail.com"

describe('Vendor deliveries test', () => {
    beforeEach(async function () {
        vendor = new Api();
        user = new Api();
        await vendor.login(testVend, testVendPass);
        await user.login(testUser, testPass);

    });
    it('Post and get a delivery', async () => {
        let delivery1 = {
            vendorId: vendormail,
            userId: usermail,
            deliverytime: "2021-04-20",
            menuId: "1",
            cancelled: false
        };
        let delivery2 = {
            vendorId: vendormail,
            userId: usermail,
            deliverytime: "2021-04-01",
            menuId: "2",
            cancelled: true
        };
        let delivery3 = {
            vendorId: vendormail,
            userId: usermail,
            deliverytime: "2021-05-01",
            menuId: "1",
            cancelled: false
        };
        let delivery4 = {
            vendorId: vendormail,
            userId: usermail,
            deliverytime: "2021-05-31",
            menuId: "2",
            cancelled: false
        };

        const getResult = await vendor.getAllVendorsDeliveries("2021-04-01", "2021-04-30");
        console.log(getResult)

        expect(getResult.length).to.equal(2);
        let res2 = getResult.find( ({deliverytime}) => deliverytime === "2021-04-01");
        console.log(res2)
        expect(res2.menuId).to.equal("2");
        //let res3 = getDelsForAllSubs.find( ({deliverytime}) => deliverytime === "2021-05-01");
        //expect(res3.menu).to.equal("lunch");
        //let res4 = getDelsForAllSubs.find( ({deliverytime}) => deliverytime === "2021-04-20");
        //expect(res4.menu).to.equal("lunch");
        //let res5 = getDelsForAllSubs.find( ({deliverytime}) => deliverytime === "2021-04-01");
        //expect(res5.menu).to.equal("dinner");

        let newDeliveries = [{
            vendorId: vendormail,
            userId: usermail,
            deliverytime: "2021-06-01",
            menuId: "1", 
            cancelled: false
        },
        {
            vendorId: vendormail,
            userId: usermail,
            deliverytime: "2021-06-15",
            menuId: "1", 
            cancelled: false        
        },
        {
            vendorId: vendormail,
            userId: usermail,
            deliverytime: "2021-06-30",
            menuId: "1", 
            cancelled: false        
        }];

        let putRes = await vendor.postNewDeliveries("2021-06-30", 3, usermail);
        console.log("Hallo", putRes)

    });
    afterEach(async function () {
        await vendor.logout();
        await user.logout();
    });
});