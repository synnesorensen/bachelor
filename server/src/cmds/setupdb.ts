#!/usr/bin/env node
import {addDeliveriesToDb, addSubsToDb, addUsersToDb, addVendorToDb} from '../scripts/DBsetup'

console.log('Initializing DB with test data');

async function runAll() {
    await addUsersToDb();
    await addVendorToDb();
    await addSubsToDb(); 
    await addDeliveriesToDb();

    console.log("DB operation done");
}

runAll();