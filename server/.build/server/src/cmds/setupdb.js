#!/usr/bin/env node
"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const DBsetup_1 = require("../scripts/DBsetup");
console.log('Initializing DB with test data');
async function runAll() {
    await DBsetup_1.addUsersToDb();
    await DBsetup_1.addVendorToDb();
    await DBsetup_1.addSubsToDb();
    await DBsetup_1.addDeliveriesToDb();
    console.log("DB operation done");
}
runAll();
//# sourceMappingURL=setupdb.js.map