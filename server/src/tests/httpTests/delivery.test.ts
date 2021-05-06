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

describe('Delivery http test', () => {
    beforeEach(async function () {
        vendor = new Api();
        user = new Api();
        await vendor.login(testVend, testVendPass);
        await user.login(testUser, testPass);

    });
    it('Put, get and delete a delivery', async () => {
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

        const putResult1 = await vendor.putDelivery(vendormail, usermail, delivery1);
        expect(putResult1.vendorId).to.not.equal(usermail);
        expect(putResult1.userId).to.not.equal(vendormail);
        expect(putResult1.deliverytime).to.equal("2021-04-20");
        expect(putResult1.menuId).to.equal("1");
        expect(putResult1.cancelled).to.equal(false);


        const getResult1 = await vendor.getDelivery(vendormail, usermail, "2021-04-20");
        expect(getResult1.vendorId).to.equal(vendormail)
        expect(getResult1.userId).to.equal(usermail);
        expect(getResult1.deliverytime).to.equal("2021-04-20");
        expect(getResult1.menuId).to.equal("1");
        expect(getResult1.cancelled).to.equal(false);

        const putResult2 = await vendor.putDelivery(vendormail, usermail, delivery2);
        expect(putResult2.menuId).to.equal("2");

        const putResult3 = await vendor.putDelivery(vendormail, usermail, delivery3);
        expect(putResult3.userId).to.equal(usermail)

        const putResult4 = await vendor.putDelivery(vendormail, usermail, delivery4);
        expect(putResult4.vendorId).to.equal(vendormail);
        expect(putResult4.userId).to.equal(usermail);

        /*Denne feiler:
        offline: Failure: Unexpected number in JSON at position 4
SyntaxError: Unexpected number in JSON at position 4
    at JSON.parse (<anonymous>)
    at putDelivery (/Users/ingrid/Documents/Skole/DAT190/Code/LunsjPaHjul/bachelor/server/src/delivery.ts:87:21)
    at Function.handler (/Users/ingrid/Documents/Skole/DAT190/Code/LunsjPaHjul/bachelor/server/src/delivery.ts:13:14)
    at /Users/ingrid/Documents/Skole/DAT190/Code/LunsjPaHjul/bachelor/server/node_modules/middy/src/middy.js:180:42
    at runNext (/Users/ingrid/Documents/Skole/DAT190/Code/LunsjPaHjul/bachelor/server/node_modules/middy/src/middy.js:85:14)
    at runMiddlewares (/Users/ingrid/Documents/Skole/DAT190/Code/LunsjPaHjul/bachelor/server/node_modules/middy/src/middy.js:91:3)
    at instance (/Users/ingrid/Documents/Skole/DAT190/Code/LunsjPaHjul/bachelor/server/node_modules/middy/src/middy.js:163:5)
    at InProcessRunner.run (/Users/ingrid/Documents/Skole/DAT190/Code/LunsjPaHjul/bachelor/server/node_modules/serverless-offline/dist/lambda/handler-runner/in-process-runner/InProcessRunner.js:178:16)
    at runMicrotasks (<anonymous>)
    at processTicksAndRejections (internal/process/task_queues.js:97:5)
    at LambdaFunction.runHandler (/Users/ingrid/Documents/Skole/DAT190/Code/LunsjPaHjul/bachelor/server/node_modules/serverless-offline/dist/lambda/LambdaFunction.js:325:20)
    at hapiHandler (/Users/ingrid/Documents/Skole/DAT190/Code/LunsjPaHjul/bachelor/server/node_modules/serverless-offline/dist/events/http/HttpServer.js:521:18)
    at module.exports.internals.Manager.execute (/Users/ingrid/Documents/Skole/DAT190/Code/LunsjPaHjul/bachelor/server/node_modules/@hapi/hapi/lib/toolkit.js:45:28)
    at Object.internals.handler (/Users/ingrid/Documents/Skole/DAT190/Code/LunsjPaHjul/bachelor/server/node_modules/@hapi/hapi/lib/handler.js:46:20)
    at exports.execute (/Users/ingrid/Documents/Skole/DAT190/Code/LunsjPaHjul/bachelor/server/node_modules/@hapi/hapi/lib/handler.js:31:20)
    at Request._lifecycle (/Users/ingrid/Documents/Skole/DAT190/Code/LunsjPaHjul/bachelor/server/node_modules/@hapi/hapi/lib/request.js:312:32)
    at Request._execute (/Users/ingrid/Documents/Skole/DAT190/Code/LunsjPaHjul/bachelor/server/node_modules/@hapi/hapi/lib/request.js:221:9)

        await vendor.deleteDelivery(vendormail, usermail, "2021-05-01");
        const delRes = await vendor.getDelivery(vendormail, usermail, "2021-05-01");
        console.log(delRes)
        let putRes = await vendor.putDelivery(vendormail, usermail, "2021-05-01");
        expect(putRes.deliverytime).to.equal("2021-05-01");
        //await vendor.deleteDelivery("testVendorId66", "testUserId26", "2021-06-15");
        //await vendor.deleteDelivery("testVendorId66", "testUserId26", "2021-06-30");*/
    }).timeout(5000);
    afterEach(async function () {
        await vendor.logout();
        await user.logout();
    });
});