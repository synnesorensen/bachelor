#!/usr/bin/env node
import {addSubsToDb, addUsersToDb, addVendorToDb} from '../scripts/DBsetup'

console.log('Initializing DB with test data');

async function runAll() {
  await addUsersToDb();
  await addVendorToDb();
  await addSubsToDb(); 

  console.log("DB operation done");
}

runAll();