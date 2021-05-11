"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.addDeliveriesToDb = exports.addSubsToDb = exports.addVendorToDb = exports.addUsersToDb = void 0;
require('dotenv').config();
require("source-map-support/register");
const dbUtils_1 = require("../dbUtils");
const settings_1 = require("../../../common/settings");
const addDeliveries_1 = require("./../addDeliveries");
const userprofile1 = {
    fullname: "Ole Olsen",
    address: "Smauet 110 5000 Sentrum",
    phone: "12345678",
    email: settings_1.dbUser1,
    allergies: ["melk"],
    isVendor: false
};
const userprofile2 = {
    fullname: "Olga Karidotter",
    address: "Sollien 8 5001 Lien",
    phone: "23456789",
    email: settings_1.dbUser2,
    allergies: [],
    isVendor: false
};
const userprofile3 = {
    fullname: "Stig Hugo",
    address: "Lauvstien 31 5000 Sentrum",
    phone: "34567890",
    email: settings_1.dbUser3,
    allergies: ["løk, svovel"],
    isVendor: false
};
const userprofile4 = {
    fullname: "Katy Sekken",
    address: "Oppoverbakken 17 5000 Sentrum",
    phone: "45678901",
    email: settings_1.dbUser4,
    allergies: ["gluten"],
    isVendor: false
};
const userprofile5 = {
    fullname: "Jan Jankovich",
    address: "Lykkegata 8 5002 Øvreåsen",
    phone: "56789012",
    email: settings_1.dbUser5,
    allergies: [],
    isVendor: false
};
const userprofileVendor = {
    fullname: "Helene Haare",
    address: "Hakkebakken 2 5003 Skogen",
    phone: "67890123",
    email: settings_1.dbVendor,
    allergies: [],
    isVendor: true
};
async function addUsersToDb() {
    await dbUtils_1.putUserprofileInDb(userprofile1, settings_1.dbUser1);
    await dbUtils_1.putUserprofileInDb(userprofile2, settings_1.dbUser2);
    await dbUtils_1.putUserprofileInDb(userprofile3, settings_1.dbUser3);
    await dbUtils_1.putUserprofileInDb(userprofile4, settings_1.dbUser4);
    await dbUtils_1.putUserprofileInDb(userprofile5, settings_1.dbUser5);
    await dbUtils_1.putUserprofileInDb(userprofileVendor, settings_1.dbVendor);
}
exports.addUsersToDb = addUsersToDb;
const vendor = {
    company: "Delikatessen",
    fullname: "Bakermester Harepus",
    address: "Hakkebakkeskogen",
    phone: "6688552",
    email: settings_1.dbVendor,
    schedule: [
        {
            "id": "2",
            "day": "Tirsdag",
            "time": "1000",
            "menu": "Lunsj"
        },
        {
            "id": "3",
            "day": "Onsdag",
            "time": "1000",
            "menu": "Lunsj"
        },
        {
            "id": "41",
            "day": "Torsdag",
            "time": "1000",
            "menu": "Lunsj med fisk"
        }
    ]
};
async function addVendorToDb() {
    await dbUtils_1.putVendorInDb(vendor, settings_1.dbVendor);
}
exports.addVendorToDb = addVendorToDb;
const sub1 = {
    vendorId: settings_1.dbVendor,
    userId: settings_1.dbUser1,
    approved: true,
    paused: false,
    schedule: ["2", "3"],
    noOfMeals: 1,
    box: "Engangsboks"
};
const sub2 = {
    vendorId: settings_1.dbVendor,
    userId: settings_1.dbUser2,
    approved: true,
    paused: false,
    schedule: ["2"],
    noOfMeals: 1,
    box: "Gjenbruksboks"
};
const sub3 = {
    vendorId: settings_1.dbVendor,
    userId: settings_1.dbUser3,
    approved: true,
    paused: false,
    schedule: ["41"],
    noOfMeals: 1,
    box: "Engangsboks"
};
const sub4 = {
    vendorId: settings_1.dbVendor,
    userId: settings_1.dbUser4,
    approved: true,
    paused: false,
    schedule: ["3"],
    noOfMeals: 1,
    box: "Engangsboks"
};
const sub5 = {
    vendorId: settings_1.dbVendor,
    userId: settings_1.dbUser5,
    approved: true,
    paused: false,
    schedule: ["2", "41"],
    noOfMeals: 1,
    box: "Gjenbruksboks"
};
async function addSubsToDb() {
    await dbUtils_1.putSubscriptionInDb(sub1, false);
    await dbUtils_1.putSubscriptionInDb(sub2, false);
    await dbUtils_1.putSubscriptionInDb(sub3, false);
    await dbUtils_1.putSubscriptionInDb(sub4, false);
    await dbUtils_1.putSubscriptionInDb(sub5, false);
}
exports.addSubsToDb = addSubsToDb;
async function addDeliveriesToDb() {
    let date = new Date("2021-05-01");
    let deliveries1 = await addDeliveries_1.generateDeliveries(date, settings_1.dbUser1, settings_1.dbVendor, 8);
    await dbUtils_1.saveDeliveriesToDb(deliveries1);
    let deliveries2 = await addDeliveries_1.generateDeliveries(date, settings_1.dbUser2, settings_1.dbVendor, 4);
    await dbUtils_1.saveDeliveriesToDb(deliveries2);
    let deliveries3 = await addDeliveries_1.generateDeliveries(date, settings_1.dbUser3, settings_1.dbVendor, 4);
    await dbUtils_1.saveDeliveriesToDb(deliveries3);
    let deliveries4 = await addDeliveries_1.generateDeliveries(date, settings_1.dbUser4, settings_1.dbVendor, 4);
    await dbUtils_1.saveDeliveriesToDb(deliveries4);
    let deliveries5 = await addDeliveries_1.generateDeliveries(date, settings_1.dbUser5, settings_1.dbVendor, 8);
    await dbUtils_1.saveDeliveriesToDb(deliveries5);
}
exports.addDeliveriesToDb = addDeliveriesToDb;
//# sourceMappingURL=DBsetup.js.map