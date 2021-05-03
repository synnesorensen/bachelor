require('dotenv').config();
import 'source-map-support/register';
import api from '../../../clients/webclient/src/api/api';
import { testPass, testUser, testVend, testVendPass} from '../../../common/settings';
import getAuth from '../../../clients/webclient/src/components/LoginDialog/auth'
import { expect } from 'chai';
import 'mocha';
import { ConfigurationServicePlaceholders } from 'aws-sdk/lib/config_service_placeholders';

/*describe('Client delivery tests', () => {
    it('Put, get and delete a delivery', async () => {
        const auth = getAuth();
        let username = testUser;
        let password = testPass;
        let signedInUser = await auth.signIn(username, password);

        let delivery1 = {
            vendorId: "ingrid.elisabeth.hjelle+test98@gmail.com",
            userId: "ingrid.elisabeth.hjelle+test98@gmail.com",
            deliverytime: "2021-04-20",
            menu: "lunch", 
            cancelled: false
        };
        let delivery2 = {
            vendorId: "ingrid.elisabeth.hjelle+test98@gmail.com",
            userId: "ingrid.elisabeth.hjelle+test98@gmail.com",
            deliverytime: "2021-04-01",
            menu: "dinner", 
            cancelled: true
        };
        let delivery3 = {
            vendorId: "ingrid.elisabeth.hjelle+test98@gmail.com",
            userId: "ingrid.elisabeth.hjelle+test98@gmail.com",
            deliverytime: "2021-05-01",
            menu: "lunch", 
            cancelled: false
        };
        let delivery4 = {
            vendorId: "ingrid.elisabeth.hjelle+test98@gmail.com",
            userId: "ingrid.elisabeth.hjelle+test98@gmail.com",
            deliverytime: "2021-05-31",
            menu: "dinner", 
            cancelled: false
        };

        const putResult = await putDelivery("ingrid.elisabeth.hjelle+test98@gmail.com", "ingrid.elisabeth.hjelle+test98@gmail.com", delivery1);
        expect(putResult.deliverytime).to.equal("2021-04-20");
        expect(putResult.menu).to.equal("lunch");
        expect(putResult.cancelled).to.equal(false);
        

        const getResult = await getDelivery("ingrid.elisabeth.hjelle+test98@gmail.com", "ingrid.elisabeth.hjelle+test98@gmail.com", "2021-04-20");
        expect(getResult.deliverytime).to.equal("2021-04-20");
        expect(getResult.menu).to.equal("lunch");
        expect(getResult.cancelled).to.equal(false);

        
        const newPut = await putDelivery("ingrid.elisabeth.hjelle+test98@gmail.com", "ingrid.elisabeth.hjelle+test98@gmail.com", delivery2);
        expect(newPut.menu).to.equal("dinner");

        console.log("Her  er  new put", newPut)
        try {
            const getAllUDels = await getAllUsersDeliveries("2021-04-01", "2021-04-30");
        console.log("Her kommer første", getAllUDels)
        } catch(e) {
            console.log("Det  gikk te helvette", e.message)
            console.dir(e)
        }
 
        
        const getAllVDels = await getAllVendorsDeliveries("2021-04-01", "2021-04-30");

        
        const getAllUserDel = await getAllUsersDeliveries("2021-04-01", "2021-04-30");
        //expect(getAllUDels).to.equal(0);
        console.log("Her Steinar", getAllUserDel)
        let res1 = getAllUserDel.find( ({deliverytime}) => deliverytime === "2021-04-01");
        console.log("her kommer res1", res1)
        expect(res1.cancelled).to.equal(true);
        expect(res1.deliverytime).to.equal("2021-04-01");
        expect(res1.menu).to.equal("dinner");

        await putDelivery("testVendorId66", "testUserId26", delivery3);
        await putDelivery("testVendorId66", "testUserId26", delivery4);

        //let getDelsForAllSubs = await getAllVendorsDeliveries("testVendorId66", "2021-04-01", "2021-05-31");
        //console.log(getDelsForAllSubs)

        //expect(getDelsForAllSubs.length).to.equal(4);
        //let res2 = getDelsForAllSubs.find( ({deliverytime}) => deliverytime === "2021-05-31");
        //expect(res2.menu).to.equal("dinner");
        //let res3 = getDelsForAllSubs.find( ({deliverytime}) => deliverytime === "2021-05-01");
        //expect(res3.menu).to.equal("lunch");
        //let res4 = getDelsForAllSubs.find( ({deliverytime}) => deliverytime === "2021-04-20");
        //expect(res4.menu).to.equal("lunch");
        //let res5 = getDelsForAllSubs.find( ({deliverytime}) => deliverytime === "2021-04-01");
        //expect(res5.menu).to.equal("dinner");

        /*await deleteDelivery("testVendorId66", "testUserId16", "2021-04-20");
        const testDelete1 = await getDelivery("testVendorId66", "testUserId16", "2021-04-20");
        expect(testDelete1).to.equal(undefined);
        await deleteDelivery("testVendorId66", "testUserId16", "2021-04-01");
        const testDelete2 = await getDelivery("testVendorId66", "testUserId16", "2021-04-01");
        expect(testDelete2).to.equal(undefined);

        let newDeliveries = [{
            vendorId: "testVendorId66",
            userId: "testUserId26",
            deliverytime: "2021-06-01",
            menu: "dinner", 
            cancelled: false
        },
        {
            vendorId: "testVendorId66",
            userId: "testUserId26",
            deliverytime: "2021-06-15",
            menu: "lunch", 
            cancelled: false        
        },
        {
            vendorId: "testVendorId66",
            userId: "testUserId26",
            deliverytime: "2021-06-30",
            menu: "lunch", 
            cancelled: false        
        }]
/*
        await postDeliveries(newDeliveries);
        let postNewDels = await getUsersDeliveries("testVendorId66", "testUserId26", "2021-06-01", "2021-06-30");
        expect(postNewDels.length).to.equal(3);
        let firstDel = postNewDels.find( ({deliverytime}) => deliverytime === "2021-06-15");
        expect(firstDel.menu).to.equal("lunch");
        expect(firstDel.cancelled).to.equal(false);
        expect(firstDel.userId).to.equal("testUserId26");

        await deleteDeliveryInDb("testVendorId66", "testUserId26", "2021-05-01");
        const newGet3 = await getDeliveryFromDb("testVendorId66", "testUserId26", "2021-05-01");
        expect(newGet3).to.equal(undefined);
        await deleteDeliveryInDb("testVendorId66", "testUserId26", "2021-05-31");
        const newGet4 = await getDeliveryFromDb("testVendorId66", "testUserId26", "2021-05-31");
        expect(newGet4).to.equal(undefined);

        await deleteDeliveryInDb("testVendorId66", "testUserId26", "2021-06-01");
        await deleteDeliveryInDb("testVendorId66", "testUserId26", "2021-06-15");
        await deleteDeliveryInDb("testVendorId66", "testUserId26", "2021-06-30"); 
    }).timeout(5000);
});*/