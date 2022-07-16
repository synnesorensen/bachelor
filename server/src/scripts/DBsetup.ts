require('dotenv').config();
import 'source-map-support/register';
import { putSubscriptionInDb, putUserprofileInDb, putVendorInDb } from '../dbUtils';
import {dbUser1, dbUser2, dbUser3, dbUser4, dbUser5, dbUser6, dbUser7, dbVendor} from '../../../common/settings';

const approved: "new" | "approved" | "denied" = "new";

const userprofile1 = {
  fullname: "Ole Olsen",
  address: "Smauet 110 5000 Sentrum",
  deliveryAddress: "Smauet 110 5000 Sentrum",
  phone: "12345678",
  email: dbUser1,
  allergies: ["Melk"],
  approved,
  isVendor: false
}
const userprofile2 = {
  fullname: "Olga Karidotter",
  address: "Sollien 8 5001 Lien",
  deliveryAddress: "Sollien 8 5001 Lien",
  phone: "23456789",
  email: dbUser2,
  allergies: [],
  approved,
  isVendor: false
}
const userprofile3 = {
  fullname: "Stig Hugo",
  address: "Lauvstien 31 5000 Sentrum",
  deliveryAddress: "Lauvstien 31 5000 Sentrum",
  phone: "34567890",
  email: dbUser3,
  allergies: ["Løk", "Svovel"],
  approved,
  isVendor: false
}
const userprofile4 = {
  fullname: "Katy Sekken",
  address: "Oppoverbakken 17 5000 Sentrum",
  deliveryAddress: "Oppoverbakken 17 5000 Sentrum",
  phone: "45678901",
  email: dbUser4,
  allergies: ["Gluten"],
  approved,
  isVendor: false
}
const userprofile5 = {
  fullname: "Jan Jankovich",
  address: "Lykkegata 8 5002 Øvreåsen",
  deliveryAddress: "Lykkegata 8 5002 Øvreåsen",
  phone: "56789012",
  email: dbUser5,
  allergies: [],
  approved,
  isVendor: false
}

const userprofile6 = {
  fullname: "Penny Pøbel",
  address: "Kroken 3 5000 Sentrum",
  deliveryAddress: "Kroken 3 5000 Sentrum",
  phone: "67890123",
  email: dbUser6,
  allergies: ["Melk"],
  approved,
  isVendor: false
}

const userprofile7 = {
  fullname: "Kristin Lavransdatter",
  address: "Sel 14 2670 Gudbrandsdalen",
  deliveryAddress: "Sel 14 2670 Gudbrandsdalen",
  phone: "22113344",
  email: dbUser7,
  allergies: ["Gluten", "Egg"],
  approved,
  isVendor: false
}

const userprofileVendor = {
  fullname: "Helene Haare",
  address: "Hakkebakken 2 5003 Skogen",
  deliveryAddress: "Hakkebakken 2 5003 Skogen",
  phone: "67890123",
  email: dbVendor,
  allergies: [],
  approved,
  isVendor: true
}

export async function addUsersToDb() {
  await putUserprofileInDb(userprofile1, dbUser1, false);
  await putUserprofileInDb(userprofile2, dbUser2, false);
  await putUserprofileInDb(userprofile3, dbUser3, false);
  await putUserprofileInDb(userprofile4, dbUser4, false);
  await putUserprofileInDb(userprofile5, dbUser5, false);
  await putUserprofileInDb(userprofile6, dbUser6, false);
  await putUserprofileInDb(userprofile7, dbUser7, false);
  await putUserprofileInDb(userprofileVendor, dbVendor, true);
}

const vendor = {
  vendorId: dbVendor,
  company: "Delikatessen",
  fullname: "Bakermester Harepus",
  address: "Hakkebakkeskogen",
  phone: "6688552",
  email: dbVendor,
  schedule: [
    {
      "id": "2",
      "day": "Tirsdag",
      "time": "36000000",
      "menu": "Gratuatysdag"
    },
    {
      "id": "3",
      "day": "Onsdag",
      "time": "36000000",
      "menu": "Onsdagssalaten"
    },
    {
      "id": "4",
      "day": "Torsdag",
      "time": "36000000",
      "menu": "Påkebåol"
    }
  ]
};

export async function addVendorToDb() {
  await putVendorInDb(vendor, dbVendor)
}

const sub1 = {
  vendorId: dbVendor,
  userId: dbUser1,
  paused: false,
  schedule: ["2", "3"], 
  noOfMeals: 1,
  box: "Engangsboks"
}
const sub2 = {
  vendorId: dbVendor,
  userId: dbUser2,
  paused: false,
  schedule: ["2"], 
  noOfMeals: 1,
  box: "Gjenbruksboks"
}
const sub3 = {
  vendorId: dbVendor,
  userId: dbUser3,
  paused: false,
  schedule: ["4"], 
  noOfMeals: 1,
  box: "Engangsboks"
}
const sub4 = {
  vendorId: dbVendor,
  userId: dbUser4,
  paused: false,
  schedule: ["3"], 
  noOfMeals: 1,
  box: "Engangsboks"
}
const sub5 = {
  vendorId: dbVendor,
  userId: dbUser5,
  paused: false,
  schedule: ["2", "4"], 
  noOfMeals: 1,
  box: "Gjenbruksboks"
}
const sub6 = {
  vendorId: dbVendor,
  userId: dbUser6,
  paused: false,
  schedule: ["4"], 
  noOfMeals: 1,
  box: "Gjenbruksboks"
}

export async function addSubsToDb() {
  await putSubscriptionInDb(sub1);
  await putSubscriptionInDb(sub2);
  await putSubscriptionInDb(sub3);
  await putSubscriptionInDb(sub4);
  await putSubscriptionInDb(sub5);
  await putSubscriptionInDb(sub6);
}

