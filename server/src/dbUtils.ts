import 'source-map-support/register'
import { DynamoDB } from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Subscription, UserSubscription, Userprofile, Delivery, Vendor, DeliveryDetail } from '../../common/interfaces';
import * as settings from '../../common/settings';
import { generateDeliveriesForSubscribers } from './addDeliveries';
import { DeliveryDto, DeliveryRequestDto } from '../../common/dto';
import { dbenv } from './DbEnvironment';

const database = new DynamoDB({ region: settings.REGION });
const documentClient = new DocumentClient({ region: settings.REGION });

export async function getAllUsersFromDb() {
  let params = {
    TableName: settings.TABLENAME,
    IndexName: "GSI1",
    KeyConditionExpression: "#GSI1_pk = :user and begins_with(#GSI1_sk, :prefix)",
    FilterExpression: "#isVendor = :false",
    ExpressionAttributeNames: {
      "#GSI1_pk": "GSI1_pk",
      "#GSI1_sk": "GSI1_sk",
      "#isVendor": "isVendor"
    },
    ExpressionAttributeValues: {
      ":user": "user",
      ":prefix": "u#",
      ":false": false
    }
  };
  let result = await documentClient.query(params).promise();

  if (result.Items.length == 0) {
    return [];
  }
  let users: Userprofile[] = await Promise.all(result.Items.map(async user => {
    return {
      userId: user.pk.substr(2),
      fullname: user.fullname,
      address: user.address,
      deliveryAddress: user.deliveryAddress,
      phone: user.phone,
      email: user.email,
      allergies: user.allergies ? user.allergies : [],
      approved: user.approved,
      isVendor: user.isVendor,
      note: user.note
    }
  }));
  return users;
}

export async function getSubscriptionFromDb(vendorId: string, userId: string): Promise<Subscription | null> {
  let subscriptionParams = {
    TableName: settings.TABLENAME,
    KeyConditionExpression: "#pk = :vendor and #sk = :userId",
    ExpressionAttributeNames: {
      "#pk": "pk",
      "#sk": "sk"
    },
    ExpressionAttributeValues: {
      ":vendor": "v#" + vendorId,
      ":userId": "u#" + userId
    }
  }
  let subscriptionResult = await documentClient.query(subscriptionParams).promise();
  if (subscriptionResult.Items.length == 0) {
    return null;
  }

  return {
    vendorId,
    userId,
    paused: subscriptionResult.Items[0].paused,
    datePaused: subscriptionResult.Items[0].datePaused,
    outstandingDeliveries: subscriptionResult.Items[0].outstandingDeliveries,
    schedule: subscriptionResult.Items[0].schedule.values,
    noOfMeals: subscriptionResult.Items[0].noOfMeals,
    box: subscriptionResult.Items[0].box
  };
}

export async function putSubscriptionInDb(subscription: Subscription): Promise<Subscription> {
  let UpdateExpression = "set EntityType = :EntityType";
  let ExpressionAttributeValues: any = {
    ":EntityType": { S: 'Subscription' }
  };

  if (subscription.paused != undefined) {
    UpdateExpression += ", paused = :paused";
    ExpressionAttributeValues[":paused"] = { BOOL: subscription.paused };
  }
  if (subscription.schedule) {
    UpdateExpression += ", schedule = :schedule";
    ExpressionAttributeValues[":schedule"] = { SS: subscription.schedule };
  }
  if (subscription.noOfMeals) {
    UpdateExpression += ", noOfMeals = :noOfMeals";
    ExpressionAttributeValues[":noOfMeals"] = { N: subscription.noOfMeals.toString() };
  }
  if (subscription.box) {
    UpdateExpression += ", box = :box";
    ExpressionAttributeValues[":box"] = { S: subscription.box };
  }

  UpdateExpression += ", GSI1_pk = :userId";
  ExpressionAttributeValues[":userId"] = { S: "u#" + subscription.userId };

  UpdateExpression += ", GSI1_sk = :vendorId";
  ExpressionAttributeValues[":vendorId"] = { S: "v#" + subscription.vendorId };

  let params = {
    TableName: settings.TABLENAME,
    Key: {
      "pk": { S: "v#" + subscription.vendorId },
      "sk": { S: "u#" + subscription.userId }
    },
    UpdateExpression,
    ExpressionAttributeValues,
    ReturnValues: "ALL_NEW"
  };

  let dbItem = await database.updateItem(params).promise();
  return {
    vendorId: subscription.vendorId,
    userId: subscription.userId,
    paused: dbItem.Attributes.paused?.BOOL || false,
    schedule: dbItem.Attributes.schedule?.SS || [],
    noOfMeals: parseInt(dbItem.Attributes.noOfMeals.N),
    box: dbItem.Attributes.box.S
  };
}

export async function updateApproval(userId: string, approved: boolean, note: string): Promise<void> {
  let UpdateExpression = "set approved = :approved";
  let ExpressionAttributeValues: any = {}

  if (approved) {
    ExpressionAttributeValues[":approved"] = { S: "approved" }
  } else {
    ExpressionAttributeValues[":approved"] = { S: "denied" }
  }


  if (note) {
    UpdateExpression += ", note = :note";
    ExpressionAttributeValues[":note"] = { S: note }
  }

  let params = {
    TableName: settings.TABLENAME,
    Key: {
      "pk": { S: "u#" + userId },
      "sk": { S: "u#" + userId }
    },
    UpdateExpression,
    ExpressionAttributeValues
  };
  await database.updateItem(params).promise();
}

export async function deleteSubscriptionInDb(vendorId: string, userId: string): Promise<void> {
  let params = {
    TableName: settings.TABLENAME,
    Key: {
      'pk': { S: 'v#' + vendorId },
      'sk': { S: 'u#' + userId }
    }
  };
  await database.deleteItem(params).promise();
}

export async function getVendorFromDb(): Promise<Vendor | null> {
  let params = {
    TableName: settings.TABLENAME,
    IndexName: "GSI1",
    Limit: 1,
    KeyConditionExpression: "#GSI1_pk = :vendor and begins_with(#GSI1_sk, :prefix)",
    ExpressionAttributeNames: {
      "#GSI1_pk": "GSI1_pk",
      "#GSI1_sk": "GSI1_sk"
    },
    ExpressionAttributeValues: {
      ":vendor": "vendor",
      ":prefix": "v#"
    }
  };
  let dbResult = await documentClient.query(params).promise();
  if (dbResult.Items.length == 0) {
    return null;
  }
  return {
    vendorId: dbResult.Items[0].email,
    company: dbResult.Items[0].company,
    fullname: dbResult.Items[0].fullname,
    address: dbResult.Items[0].address,
    phone: dbResult.Items[0].phone,
    email: dbResult.Items[0].email,
    schedule: dbResult.Items[0].schedule
  };
}

export async function putVendorInDb(vendor: Vendor, vendorId: string): Promise<Vendor> {
  let params = {
    TableName: settings.TABLENAME,
    IndexName: "GSI1",
    Item: {
      pk: "v#" + vendorId,
      sk: "v#" + vendorId,
      EntityType: "Vendor",
      company: vendor.company,
      fullname: vendor.fullname,
      address: vendor.address,
      phone: vendor.phone,
      email: vendor.email,
      schedule: vendor.schedule,
      GSI1_pk: "vendor",
      GSI1_sk: "v#" + vendorId
    }
  };

  await documentClient.put(params).promise();
  return {
    vendorId,
    company: vendor.company,
    fullname: vendor.fullname,
    address: vendor.address,
    phone: vendor.phone,
    email: vendor.email,
    schedule: vendor.schedule
  };
}

export async function getUserprofileFromDb(userId: string): Promise<Userprofile> {
  let params = {
    TableName: settings.TABLENAME,
    KeyConditionExpression: "#pk = :userId and #sk = :userId",
    ExpressionAttributeNames: {
      "#pk": "pk",
      "#sk": "sk"
    },
    ExpressionAttributeValues: {
      ":userId": "u#" + userId
    }
  };
  let dbResult = await documentClient.query(params).promise();
  if (dbResult.Items.length == 0) {
    return undefined;
  }
  return {
    fullname: dbResult.Items[0].fullname,
    address: dbResult.Items[0].address,
    deliveryAddress: dbResult.Items[0].deliveryAddress,
    phone: dbResult.Items[0].phone,
    email: dbResult.Items[0].email,
    allergies: dbResult.Items[0].allergies,
    approved: dbResult.Items[0].approved ? dbResult.Items[0].approved : "new",
    isVendor: dbResult.Items[0].isVendor,
    note: dbResult.Items[0].note
  };
}

export async function putUserprofileInDb(userprofile: Userprofile, userId: string, isVendor: boolean): Promise<Userprofile> {
  let UpdateExpression = "set EntityType = :EntityType";
  let ExpressionAttributeValues: any = {
    ":EntityType": { S: 'Userprofile' }
  };

  if (isVendor) {
    if (userprofile.approved != undefined) {
      UpdateExpression += ", approved = :approved";
      ExpressionAttributeValues[":approved"] = { S: userprofile.approved };
    }
  } else {
    UpdateExpression += ", approved = if_not_exists(approved, :approved)";
    ExpressionAttributeValues[":approved"] = { S: "new" };
  }
  if (userprofile.fullname != undefined) {
    UpdateExpression += ", fullname = :fullname";
    ExpressionAttributeValues[":fullname"] = { S: userprofile.fullname };
  }
  if (userprofile.address != undefined) {
    UpdateExpression += ", address = :address";
    ExpressionAttributeValues[":address"] = { S: userprofile.address };
  }
  if (userprofile.deliveryAddress != undefined) {
    UpdateExpression += ", deliveryAddress = :deliveryAddress";
    ExpressionAttributeValues[":deliveryAddress"] = { S: userprofile.deliveryAddress };
  }
  if (userprofile.phone != undefined) {
    UpdateExpression += ", phone = :phone";
    ExpressionAttributeValues[":phone"] = { S: userprofile.phone };
  }
  if (userprofile.email != undefined) {
    UpdateExpression += ", email = :email";
    ExpressionAttributeValues[":email"] = { S: userprofile.email };
  }
  if (userprofile.allergies.length > 0) {
    UpdateExpression += ", allergies = :allergies";
    ExpressionAttributeValues[":allergies"] = { SS: userprofile.allergies };
  }
  if (userprofile.note.length > 0) {
    UpdateExpression += ", note = :note";
    ExpressionAttributeValues[":note"] = { S: userprofile.note };
  }
  if (userprofile.isVendor != undefined) {
    UpdateExpression += ", isVendor = :isVendor";
    ExpressionAttributeValues[":isVendor"] = { BOOL: userprofile.isVendor };
  }
  UpdateExpression += ", GSI1_pk = :user";
  ExpressionAttributeValues[":user"] = { S: "user" };

  UpdateExpression += ", GSI1_sk = :userId";
  ExpressionAttributeValues[":userId"] = { S: "u#" + userId };

  let params = {
    TableName: settings.TABLENAME,
    Key: {
      "pk": { S: "u#" + userId },
      "sk": { S: "u#" + userId }
    },
    UpdateExpression,
    ExpressionAttributeValues,
    ReturnValues: "ALL_NEW"
  };

  let dbItem = await database.updateItem(params).promise();
  const approved: "new" | "approved" | "denied" = "new";

  return {
    fullname: userprofile.fullname,
    address: userprofile.address,
    deliveryAddress: dbItem.Attributes.deliveryAddress.S,
    phone: dbItem.Attributes.phone.S,
    email: dbItem.Attributes.email.S,
    allergies: dbItem.Attributes.allergies?.SS,
    approved,
    isVendor: dbItem.Attributes.isVendor.BOOL,
    note: dbItem.Attributes.note?.S
  }
}

export async function deleteUserprofileInDb(userId: string): Promise<void> {
  let params = {
    TableName: settings.TABLENAME,
    Key: {
      'pk': { S: 'u#' + userId },
      'sk': { S: 'u#' + userId }
    }
  };
  await database.deleteItem(params).promise();
}

export async function getAllSubscriptionsFromDb(vendorId: string) {
  let subscriptionParams = {
    TableName: settings.TABLENAME,
    KeyConditionExpression: "#pk = :vendor and begins_with(#sk, :prefix)",
    ExpressionAttributeNames: {
      "#pk": "pk",
      "#sk": "sk"
    },
    ExpressionAttributeValues: {
      ":vendor": "v#" + vendorId,
      ":prefix": "u#"
    }
  };

  let dbResult = await documentClient.query(subscriptionParams).promise();
  if (dbResult.Items.length == 0) {
    return [];
  }

  let result = await Promise.all(dbResult.Items.map(async item => {
    const userId = item.sk.substr(2);
    let latestDelivery = await findLatestDelivery(vendorId, userId);
    return {
      vendorId,
      userId,
      paused: item.paused,
      schedule: item.schedule.values,
      noOfMeals: item.noOfMeals,
      box: item.box,
      lastDeliveryDate: latestDelivery ? latestDelivery.deliverytime : null
    }
  }));

  return result;
}

export async function getSubscriptionsForVendor(vendorId: string): Promise<UserSubscription[]> {
  let subscriptionParams = {
    TableName: settings.TABLENAME,
    KeyConditionExpression: "#pk = :vendor and begins_with(#sk, :prefix)",
    ExpressionAttributeNames: {
      "#pk": "pk",
      "#sk": "sk"
    },
    ExpressionAttributeValues: {
      ":vendor": "v#" + vendorId,
      ":prefix": "u#"
    }
  };

  let dbResult = await documentClient.query(subscriptionParams).promise();
  if (dbResult.Items.length == 0) {
    return [];
  }

  let subscriptions = dbResult.Items.map((item) => {
    return {
      vendorId,
      userId: item.sk,
      paused: item.paused,
      schedule: item.schedule.values,
      noOfMeals: item.noOfMeals,
      box: item.box
    }
  });

  let keys = dbResult.Items.map((item) => {
    return {
      "pk": item.sk,     // her må sk fra subscription brukes for å finne
      "sk": item.sk      // userprofile sin composite key
    }
  });

  let userSubscriptionParams = {
    RequestItems: {
      [settings.TABLENAME]: {
        Keys: keys,
        ProjectionExpression: "sk, fullname, address, deliveryAddress, phone, email, allergies, approved"
      }
    }
  };

  let users = await documentClient.batchGet(userSubscriptionParams).promise();
  let subshash = new Map<string, Subscription>();

  subscriptions.forEach((sub) => {
    subshash.set(sub.userId, sub);
  });

  let vendorParams = {
    TableName: settings.TABLENAME,
    KeyConditionExpression: "#pk = :vendor and #sk = :vendor",
    ExpressionAttributeNames: {
      "#pk": "pk",
      "#sk": "sk"
    },
    ExpressionAttributeValues: {
      ":vendor": "v#" + vendorId
    }
  }
  let vendorResult = await documentClient.query(vendorParams).promise();
  if (vendorResult.Items.length == 0) {
    return undefined;
  }
  let vendorSchedule = vendorResult.Items[0].schedule;

  let result: UserSubscription[] = await Promise.all(users.Responses[settings.TABLENAME].map(async user => {
    let sub = subshash.get(user.sk);
    let userSchedule = vendorSchedule.filter((item) => sub.schedule.includes(item.id));
    return {
      vendorId: sub.vendorId,
      userId: sub.userId.substr(2),
      approved: user.approved,
      paused: sub.paused,
      schedule: userSchedule,
      noOfMeals: sub.noOfMeals,
      box: sub.box,
      fullname: user.fullname,
      address: user.address,
      deliveryAddress: user.deliveryAddress,
      phone: user.phone,
      email: user.email,
      allergies: user.allergies ? user.allergies : [],
      lastDeliveryDate: (await findLatestDelivery(sub.vendorId, sub.userId.substr(2)))?.deliverytime,
    }
  }));
  return result;
}

export async function getUsersDeliveries(userId: string, startDate: string, endDate?: string): Promise<Delivery[]> {
  let KeyConditionExpression = "#pk = :user and ";
  let ExpressionAttributeValues = {}

  if (endDate) {
    KeyConditionExpression += "#sk BETWEEN :prefix1 and :prefix2";
    ExpressionAttributeValues = {
      ":user": "d#" + userId,
      ":prefix1": "d#" + startDate,
      ":prefix2": "d#" + endDate
    }
  } else {
    KeyConditionExpression += "#sk >= :prefix1";
    ExpressionAttributeValues = {
      ":user": "d#" + userId,
      ":prefix1": "d#" + startDate
    }
  }
  let params = {
    TableName: settings.TABLENAME,
    KeyConditionExpression,
    ExpressionAttributeNames: {
      "#pk": "pk",
      "#sk": "sk"
    },
    ExpressionAttributeValues
  };

  let dbResult = await documentClient.query(params).promise();

  let deliveries = dbResult.Items.map((del) => {
    return {
      vendorId: del.GSI2_pk.substr(2),
      userId,
      deliverytime: del.deliverytime,
      menuId: del.menuId,
      cancelled: del.cancelled,
      deliveryType: del.deliveryType,
      paid: del.paid,
      approved: del.approved,
      noOfMeals: del.noOfMeals
    }
  });
  return deliveries;
}

export async function getDeliveryFromDb(vendorId: string, userId: string, time: string): Promise<Delivery> {
  let params = {
    TableName: settings.TABLENAME,
    KeyConditionExpression: "#pk = :user and begins_with(#sk, :prefix)",
    ExpressionAttributeNames: {
      "#pk": "pk",
      "#sk": "sk"
    },
    ExpressionAttributeValues: {
      ":user": "d#" + userId,
      ":prefix": "d#" + time
    }
  };
  let dbResult = await documentClient.query(params).promise();
  if (dbResult.Items.length == 0) {
    return undefined;
  }
  return {
    vendorId,
    userId,
    deliverytime: dbResult.Items[0].deliverytime,
    menuId: dbResult.Items[0].menuId,
    cancelled: dbResult.Items[0].cancelled,
    deliveryType: dbResult.Items[0].deliveryType,
    paid: dbResult.Items[0].paid,
    approved: dbResult.Items[0].approved,
    noOfMeals: dbResult.Items[0].noOfMeals
  };
}

// Brukes kun av kunde, derfor settes den som ikke godkjent og ikke betalt
export async function newDeliveryInDb(vendorId: string, userId: string, delivery: DeliveryDto): Promise<Delivery> {
  let UpdateExpression = "set EntityType = :EntityType";
  let ExpressionAttributeValues: any = {
    ":EntityType": { S: "Delivery" }
  }

  if (vendorId != undefined) {
    UpdateExpression += ", vendorId = :vendorId";
    ExpressionAttributeValues[":vendorId"] = { S: vendorId };
  }

  if (userId != undefined) {
    UpdateExpression += ", userId = :userId";
    ExpressionAttributeValues[":userId"] = { S: userId };
  }

  if (delivery.menuId != undefined) {
    UpdateExpression += ", menuId = :menuId";
    ExpressionAttributeValues[":menuId"] = { S: delivery.menuId };
  }

  if (delivery.deliverytime != undefined) {
    UpdateExpression += ", deliverytime = :time";
    ExpressionAttributeValues[":time"] = { S: delivery.deliverytime };
  }

  if (delivery.noOfMeals != undefined) {
    UpdateExpression += ", noOfMeals = :no";
    ExpressionAttributeValues[":no"] = { N: delivery.noOfMeals.toString() };
  }

  UpdateExpression += ", cancelled = :cancelled";
  ExpressionAttributeValues[":cancelled"] = { BOOL: false };

  UpdateExpression += ", approved = :approved";
  ExpressionAttributeValues[":approved"] = { S: "new" };

  UpdateExpression += ", paid = :paid";
  ExpressionAttributeValues[":paid"] = { S: "unpaid" };

  UpdateExpression += ", deliveryType = :deliveryType";
  UpdateExpression += ", GSI1_pk = :deliveryType";
  ExpressionAttributeValues[":deliveryType"] = { S: "single" };

  UpdateExpression += ", GSI2_pk = :vendor";
  ExpressionAttributeValues[":vendor"] = { S: "d#" + vendorId };

  UpdateExpression += ", GSI3_pk = :deliverytype";
  ExpressionAttributeValues[":deliverytype"] = { S: "d#" + userId + delivery.deliveryType };

  UpdateExpression += ", GSI1_sk = :deliverytime";
  UpdateExpression += ", GSI2_sk = :deliverytime";
  UpdateExpression += ", GSI3_sk = :deliverytime";
  ExpressionAttributeValues[":deliverytime"] = { S: "d#" + delivery.deliverytime };

  let params = {
    TableName: settings.TABLENAME,
    Key: {
      "pk": { S: "d#" + userId },
      "sk": { S: "d#" + delivery.deliverytime }
    },
    UpdateExpression,
    ExpressionAttributeValues,
    ReturnValues: "ALL_NEW"
  };

  let dbItem = await database.updateItem(params).promise();
  const approved: "new" | "approved" | "denied" = "new";
  const paid: "paid" | "unpaid" = "unpaid";
  const deliveryType: "sub" | "single" = "single";

  return {
    vendorId,
    userId,
    deliverytime: dbItem.Attributes.deliverytime.S,
    menuId: dbItem.Attributes.menuId.S,
    cancelled: dbItem.Attributes.cancelled.BOOL,
    deliveryType,
    paid,
    approved,
    noOfMeals: parseInt(dbItem.Attributes.noOfMeals.N)
  }
}

export async function changeNoOfMeals(delivery: Delivery, userId: string, vendorId: string): Promise<Delivery> {
  let UpdateExpression = "set noOfMeals = :no";
  let ExpressionAttributeValues: any = {
    ":no": { N: delivery.noOfMeals.toString() }
  }

  let params = {
    TableName: settings.TABLENAME,
    Key: {
      "pk": { S: "d#" + userId },
      "sk": { S: "d#" + delivery.deliverytime }
    },
    UpdateExpression,
    ExpressionAttributeValues,
    ReturnValues: "ALL_NEW"
  };
  
  let dbItem = await database.updateItem(params).promise();

  return {
    vendorId,
    userId,
    deliverytime: dbItem.Attributes.deliverytime.S,
    menuId: dbItem.Attributes.menuId.S,
    cancelled: dbItem.Attributes.cancelled.BOOL,
    deliveryType: delivery.deliveryType,
    paid: delivery.paid,
    approved: delivery.approved,
    noOfMeals: parseInt(dbItem.Attributes.noOfMeals.N)
  }
}

export async function deleteDeliveryInDb(userId: string, time: string): Promise<void> {
  let params = {
    TableName: settings.TABLENAME,
    Key: {
      "pk": { S: "d#" + userId },
      "sk": { S: "d#" + time }
    }
  };
  await database.deleteItem(params).promise();
}

export async function updateDeliveries(deliveries: Delivery[]): Promise<void> {
  let dels = [];
  const userId = deliveries[0].userId;
  for (let i = 0; i < deliveries.length; i++) {
    dels.push({
      TableName: settings.TABLENAME,
      Item: {
        EntityType: "Delivery",
        pk: "d#" + userId,
        sk: "d#" + deliveries[i].deliverytime,
        deliverytime: deliveries[i].deliverytime,
        menuId: deliveries[i].menuId,
        cancelled: deliveries[i].cancelled,
        deliveryType: deliveries[i].deliveryType,
        noOfMeals: deliveries[i].noOfMeals,
        paid: deliveries[i].paid,
        approved: deliveries[i].approved,
        userId: deliveries[i].userId,
        vendorId: deliveries[i].vendorId,
        GSI1_pk: deliveries[i].deliveryType,
        GSI1_sk: "d#" + deliveries[i].deliverytime,
        GSI2_pk: "d#" + deliveries[i].vendorId,
        GSI2_sk: "d#" + deliveries[i].deliverytime,
        GSI3_pk: "d#" + deliveries[i].userId + deliveries[i].deliveryType,
        GSI3_sk: "d#" + deliveries[i].deliverytime,
      }
    });
  }
  let promises = [];

  for (let del of dels) {
    promises.push(documentClient.put(del).promise());
  }

  await Promise.all(promises);

  // Remove previously moved delivery from end of period: 
  const latestDel = await findLatestDelivery(deliveries[0].vendorId, deliveries[0].userId);
  deleteDeliveryInDb(latestDel.userId, latestDel.deliverytime);
}

export async function saveDeliveriesToDb(deliveries: Delivery[]): Promise<void> {
  let dels = [];
  for (let i = 0; i < deliveries.length; i++) {
    dels.push({
      PutRequest: {
        Item: {
          EntityType: "Delivery",
          pk: "d#" + deliveries[i].userId,
          sk: "d#" + deliveries[i].deliverytime,
          userId: deliveries[i].userId,
          vendorId: deliveries[i].vendorId,
          deliverytime: deliveries[i].deliverytime,
          menuId: deliveries[i].menuId,
          cancelled: deliveries[i].cancelled,
          deliveryType: deliveries[i].deliveryType,
          paid: deliveries[i].paid,
          noOfMeals: deliveries[i].noOfMeals,
          approved: deliveries[i].approved,
          GSI1_pk: deliveries[i].deliveryType,
          GSI1_sk: "d#" + deliveries[i].deliverytime,
          GSI2_pk: "d#" + deliveries[i].vendorId,
          GSI2_sk: "d#" + deliveries[i].deliverytime,
          GSI3_pk: "d#" + deliveries[i].userId + deliveries[i].deliveryType,
          GSI3_sk: "d#" + deliveries[i].deliverytime,
        }
      }
    });

    if (dels.length == 25) {
      let params = {
        RequestItems: {
          [settings.TABLENAME]: dels
        }
      };
      await documentClient.batchWrite(params).promise();
      dels = [];
      // TODO: Sjekke for Unprocessed items på result, og legge evt feilede objekter inn igjen i dels. 
      // result.UnprocessedItems
    }
  }
  if (dels.length > 0) {
    let params = {
      RequestItems: {
        [settings.TABLENAME]: dels
      }
    };
    await documentClient.batchWrite(params).promise();
    // TODO: Sjekke for Unprocessed items på result, og legge evt feilede objekter inn igjen i dels. 
    // result.UnprocessedItems
  }
}

export async function getAllDeliveriesFromAllSubscribers(vendorId: string, startTime: string, endTime: string): Promise<Delivery[]> {
  let endDate = new Date(endTime);
  endDate.setDate(endDate.getDate() + 1);
  let nextDay = endDate.toISOString().substr(0, 10);

  let params = {
    TableName: settings.TABLENAME,
    IndexName: "GSI2",
    KeyConditionExpression: "#GSI2_pk = :vendor and #GSI2_sk BETWEEN :start and :end",
    ExpressionAttributeNames: {
      "#GSI2_pk": "GSI2_pk",
      "#GSI2_sk": "GSI2_sk"
    },
    ExpressionAttributeValues: {
      ":vendor": "d#" + vendorId,
      ":start": "d#" + startTime,
      ":end": "d#" + nextDay
    }
  };
  let dbResult = await documentClient.query(params).promise();

  let deliveries = dbResult.Items.map((del) => {
    return {
      vendorId,
      userId: del.userId,
      deliverytime: del.deliverytime,
      menuId: del.menuId,
      cancelled: del.cancelled,
      deliveryType: del.deliveryType,
      paid: del.paid,
      approved: del.approved,
      noOfMeals: del.noOfMeals
    }
  });
  return deliveries;
}

export async function getDeliveryRequestsFromDb() {
  let params = {
    TableName: settings.TABLENAME,
    IndexName: "GSI1",
    KeyConditionExpression: "#GSI1_pk = :deliveryType",
    ExpressionAttributeNames: {
      "#GSI1_pk": "GSI1_pk"
    },
    ExpressionAttributeValues: {
      ":deliveryType": "single"
    }
  };

  let dbResult = await documentClient.query(params).promise();
  let deliveries = dbResult.Items.map((del) => {
    return {
      userId: del.userId,
      deliverytime: del.deliverytime,
      menuId: del.menuId,
      cancelled: del.cancelled,
      deliveryType: del.deliveryType,
      paid: del.paid,
      approved: del.approved,
      noOfMeals: del.noOfMeals
    }
  });
  const deliveryRequests: DeliveryRequestDto[] = [];
  const promises = [];
  deliveries.forEach(del => {
    promises.push(getUserprofileFromDb(del.userId));
  });

  const userprofiles = await Promise.all(promises);
  deliveries.forEach(del => {
    const user = userprofiles.find(({ email }) => email === del.userId);
    const deliveryReq: DeliveryRequestDto = {
      ...del,
      fullname: user.fullname,
      deliveryAddress: user.deliveryAddress,
      allergies: user.allergies,
    }
    deliveryRequests.push(deliveryReq);
  });

  return deliveryRequests;
}

export async function getDeliveryRequestsByDate(startDate: string, endDate: string) {
  let params = {
    TableName: settings.TABLENAME,
    IndexName: "GSI1",
    KeyConditionExpression: "#GSI1_pk = :deliveryType and #GSI1_sk BETWEEN :start and :end",
    ExpressionAttributeNames: {
      "#GSI1_pk": "GSI1_pk",
      "#GSI1_sk": "GSI1_sk"
    },
    ExpressionAttributeValues: {
      ":deliveryType": "single",
      ":start": "d#" + startDate,
      ":end": "d#" + endDate
    }
  };

  let dbResult = await documentClient.query(params).promise();
  let deliveries = dbResult.Items.map((del) => {
    return {
      userId: del.userId,
      deliverytime: del.deliverytime,
      menuId: del.menuId,
      cancelled: del.cancelled,
      deliveryType: del.deliveryType,
      paid: del.paid,
      approved: del.approved,
      noOfMeals: del.noOfMeals
    }
  });

  const deliveryRequests: DeliveryRequestDto[] = [];
  const promises = [];
  deliveries.forEach(del => {
    promises.push(getUserprofileFromDb(del.userId));
  });

  const userprofiles = await Promise.all(promises);
  deliveries.forEach(del => {
    const user = userprofiles.find(({ email }) => email === del.userId);
    const deliveryReq: DeliveryRequestDto = {
      ...del,
      fullname: user.fullname,
      deliveryAddress: user.deliveryAddress,
      allergies: user.allergies
    }
    deliveryRequests.push(deliveryReq);
  });

  return deliveryRequests;
}

export async function findLatestDelivery(vendorId: string, userId: string): Promise<Delivery | null> {
  // Only for subscription deliveries
  let params = {
    TableName: settings.TABLENAME,
    IndexName: "GSI3",
    Limit: 1,
    ScanIndexForward: false,
    KeyConditionExpression: "#GSI3_pk = :user and begins_with(#GSI3_sk, :prefix)",
    ExpressionAttributeNames: {
      "#GSI3_pk": "GSI3_pk",
      "#GSI3_sk": "GSI3_sk"
    },
    ExpressionAttributeValues: {
      ":user": "d#" + userId + "sub",
      ":prefix": "d#"
    }
  };


  let dbResult = await documentClient.query(params).promise();
  if (dbResult.Count < 1) {
    return null;
  }

  return {
    vendorId,
    userId,
    deliverytime: dbResult.Items[0].deliverytime,
    menuId: dbResult.Items[0].menuId,
    cancelled: dbResult.Items[0].cancelled,
    deliveryType: dbResult.Items[0].deliveryType,
    paid: dbResult.Items[0].paid,
    approved: dbResult.Items[0].approved,
    noOfMeals: dbResult.Items[0].noOfMeals
  }
}

export async function getDeliveryDetails(vendorId: string, startDate: string, endDate: string): Promise<DeliveryDetail[]> {
  const allDeliveries = await getAllDeliveriesFromAllSubscribers(vendorId, startDate, endDate);
  const deliveries = allDeliveries.filter(del => !del.cancelled);
  const userSubscriptions = await getSubscriptionsForVendor(vendorId);
  const deliveryDetails: DeliveryDetail[] = [];
  const promises = [];

  deliveries.forEach(async del => {
    const user = getUserprofileFromDb(del.userId);
    promises.push(user);
  })

  const userprofiles = await Promise.all(promises);
  const userMap = new Map<string, Userprofile>();

  userprofiles.forEach(user => {
    userMap.set(user.email, user);
  })

  deliveries.forEach(async del => {
    let sub = userSubscriptions!.find(({ userId }) => userId == del.userId);
    const box = sub ? sub.box : "Engangsboks";
    const paused = sub ? sub.paused : false;
    const fullname = sub ? sub.fullname : userMap.get(del.userId).fullname;
    const address = sub ? sub.address : userMap.get(del.userId).address;
    const deliveryAddress = sub ? sub.deliveryAddress : userMap.get(del.userId).deliveryAddress;
    const phone = sub ? sub.phone : userMap.get(del.userId).phone;
    const email = sub ? sub.email : userMap.get(del.userId).email;
    const allergies = sub ? sub.allergies : userMap.get(del.userId).allergies;

    const deliveryDetail: DeliveryDetail = {
      ...del,
      paused,
      noOfMeals: del.noOfMeals,
      box,
      fullname,
      address,
      deliveryAddress,
      phone,
      email,
      allergies
    }
    deliveryDetails.push(deliveryDetail);

  });
  return deliveryDetails;
}

export async function cancelDeliveries(userId: string, deliveries: Delivery[], cancelledBy: string): Promise<number> {
  if (deliveries.length < 1) {
    return 0;
  }

  const promises: Promise<boolean>[] = [];
  for (let delivery of deliveries) {
    if (delivery.userId == userId || delivery.vendorId == userId) {
      promises.push(cancelDelivery(delivery, cancelledBy));
    }
  }
  let results = await Promise.all(promises);
  // Counting how many deliveries that were cancelled:
  let count = 0;
  results.forEach(res => {
    if (res) {
      count++;
    }
  });

  return count;
}

async function cancelDelivery(delivery: Delivery, cancelledBy: string): Promise<boolean> {
  const dbDel = await getDeliveryFromDb(delivery.vendorId, delivery.userId, delivery.deliverytime);

  if (!dbDel || dbDel.cancelled) {
    return false;
  }
  let UpdateExpression = "set cancelled = :cancelled, cancelledBy = :cancelledBy";
  let ExpressionAttributeValues: any = {
    ":cancelled": { BOOL: true },
    ":cancelledBy": { S: cancelledBy }
  };
  const params = {
    TableName: settings.TABLENAME,
    Key: {
      "pk": { S: "d#" + delivery.userId },
      "sk": { S: "d#" + delivery.deliverytime }
    },
    UpdateExpression,
    ExpressionAttributeValues
  };

  await database.updateItem(params).promise();

  // Moving cancelled delivery to the end of period:
  const latestDel = await findLatestDelivery(delivery.vendorId, delivery.userId);
  const date = new Date(latestDel.deliverytime);
  date.setDate(date.getDate() + 1);
  const movedDels = await generateDeliveriesForSubscribers(date, delivery.userId, delivery.vendorId, 1, dbenv);
  await saveDeliveriesToDb(movedDels);

  return true;
}

export async function pauseSubscription(userId: string, vendorId: string, time: string): Promise<Subscription> {
  let outstandingDeliveries = await getUsersDeliveries(userId, time);
  outstandingDeliveries = outstandingDeliveries.filter(del => !del.cancelled);
  let noOfDeliveries = outstandingDeliveries.length;

  for (let del of outstandingDeliveries) {
    await deleteDeliveryInDb(userId, del.deliverytime);
  }

  let UpdateExpression = "set paused = :paused, datePaused = :datePaused, outstandingDeliveries = :outstandingDeliveries";
  let ExpressionAttributeValues: any = {
    ":paused": { BOOL: true },
    ":datePaused": { S: time },
    ":outstandingDeliveries": { N: noOfDeliveries.toString() }
  };

  const params = {
    TableName: settings.TABLENAME,
    Key: {
      "pk": { S: "v#" + vendorId },
      "sk": { S: "u#" + userId }
    },
    UpdateExpression,
    ExpressionAttributeValues,
    ReturnValues: "ALL_NEW"
  };

  let result = await database.updateItem(params).promise();

  return {
    vendorId: result.Attributes.pk.S.substr(2),
    userId: result.Attributes.sk.S.substr(2),
    paused: result.Attributes.paused.BOOL,
    datePaused: result.Attributes.datePaused.S,
    outstandingDeliveries: parseInt(result.Attributes.outstandingDeliveries.N),
    schedule: result.Attributes.schedule.SS,
    noOfMeals: parseInt(result.Attributes.noOfMeals.N),
    box: result.Attributes.box.S
  }
}

export async function unPauseSubscription(userId: string, vendorId: string, time: string): Promise<Subscription> {
  let sub = await getSubscriptionFromDb(vendorId, userId);
  if (!sub) {
    throw ("Subscription not found for user id: " + userId);
  }
  if (!sub.paused) {
    throw ("Trying to unpause an active subscription.")
  }
  let outstandingDeliveries = sub.outstandingDeliveries;
  let date = new Date(time);
  let deliveries = await generateDeliveriesForSubscribers(date, userId, vendorId, outstandingDeliveries, dbenv);
  await saveDeliveriesToDb(deliveries);

  let UpdateExpression = "SET paused = :paused REMOVE datePaused, outstandingDeliveries";
  let ExpressionAttributeValues: any = {
    ":paused": { BOOL: false }
  };
  const params = {
    TableName: settings.TABLENAME,
    Key: {
      "pk": { S: "v#" + vendorId },
      "sk": { S: "u#" + userId }
    },
    UpdateExpression,
    ExpressionAttributeValues,
    ReturnValues: "ALL_NEW"
  };
  let result = await database.updateItem(params).promise();
  return {
    vendorId: result.Attributes.pk.S.substr(2),
    userId: result.Attributes.sk.S.substr(2),
    paused: result.Attributes.paused.BOOL,
    schedule: result.Attributes.schedule.SS,
    noOfMeals: parseInt(result.Attributes.noOfMeals.N),
    box: result.Attributes.box.S
  }
}

export async function handleDeliveryRequest(action: boolean, userId: string, time: string) {
  let UpdateExpression = "";
  let ExpressionAttributeValues: any = ""

  if (action) {
    UpdateExpression += "SET approved = :approved";
    ExpressionAttributeValues = {
      ":approved": { S: "approved" }
    }
  } else {
    UpdateExpression += "SET approved = :approved";
    ExpressionAttributeValues = {
      ":approved": { S: "denied" }
    }
  }
  const params = {
    TableName: settings.TABLENAME,
    Key: {
      "pk": { S: "d#" + userId },
      "sk": { S: "d#" + time }
    },
    UpdateExpression,
    ExpressionAttributeValues,
    ReturnValues: "ALL_NEW"
  };
  let result = await database.updateItem(params).promise();
  return {
    vendorId: result.Attributes.vendorId,
    userId: result.Attributes.userId,
    deliverytime: result.Attributes.delivertime,
    menuId: result.Attributes.menuId,
    cancelled: result.Attributes.cancelled,
    deliveryType: result.Attributes.deliveryType,
    noOfMeals: result.Attributes.noOfMeals,
    paid: result.Attributes.paid,
    approved: result.Attributes.approved
  }
}

export async function saveAbsenceToDb(dates: string[]): Promise<void> {
  let absenceDates = [];
  for (let i = 0; i < dates.length; i++) {
    absenceDates.push({
      PutRequest: {
        Item: {
          EntityType: "Absence",
          pk: "absence",
          sk: "a#" + dates[i]
        }
      }
    });

    if (absenceDates.length === 25) {
      let params = {
        RequestItems: {
          [settings.TABLENAME]: absenceDates
        }
      };
      await documentClient.batchWrite(params).promise();
      absenceDates = [];
    }
  }

  if (absenceDates.length > 0) {
    let params = {
      RequestItems: {
        [settings.TABLENAME]: absenceDates
      }
    };
    await documentClient.batchWrite(params).promise();
    // TODO: Sjekke for Unprocessed items på result
  }
}

export async function setUserAway(dates: string[]): Promise<void> {
  let absenceDates = [];
  for (let i = 0; i < dates.length; i++) {
    absenceDates.push({
      PutRequest: {
        Item: {
          EntityType: "UserAbsence",
          pk: "userAbsence",
          sk: "a#" + dates[i]
        }
      }
    });

    if (absenceDates.length === 25) {
      let params = {
        RequestItems: {
          [settings.TABLENAME]: absenceDates
        }
      };
      await documentClient.batchWrite(params).promise();
      absenceDates = [];
    }
  }

  if (absenceDates.length > 0) {
    let params = {
      RequestItems: {
        [settings.TABLENAME]: absenceDates
      }
    };
    await documentClient.batchWrite(params).promise();
    // TODO: Sjekke for Unprocessed items på result
  }
}

export async function getVendorAbsence(start: string, end?: string): Promise<Date[]> {
  let KeyConditionExpression = "#pk = :absence and ";
  if (end) {
    KeyConditionExpression += "#sk BETWEEN :start and :end";
  } else {
    KeyConditionExpression += "#sk >= :start";
  }

  const params = {
    TableName: settings.TABLENAME,
    KeyConditionExpression,
    ExpressionAttributeNames: {
      "#pk": "pk",
      "#sk": "sk"
    },
    ExpressionAttributeValues: {
      ":absence": "absence",
      ":start": "a#" + start,
      ":end": "a#" + end
    }
  };

  const dbResult = await documentClient.query(params).promise();
  return dbResult.Items.map(res => new Date(res.sk.substr(2)));
}

export async function deleteAbsenceInDb(time: string): Promise<void> {
  let params = {
    TableName: settings.TABLENAME,
    Key: {
      "pk": { S: "absence" },
      "sk": { S: "a#" + time }
    }
  };
  await database.deleteItem(params).promise();
}

export async function getUserAbsence(start: string, end?: string): Promise<Date[]> {
  let KeyConditionExpression = "#pk = :userAbsence and ";
  if (end) {
    KeyConditionExpression += "#sk BETWEEN :start and :end";
  } else {
    KeyConditionExpression += "#sk >= :start";
  }

  const params = {
    TableName: settings.TABLENAME,
    KeyConditionExpression,
    ExpressionAttributeNames: {
      "#pk": "pk",
      "#sk": "sk"
    },
    ExpressionAttributeValues: {
      ":userAbsence": "userAbsence",
      ":start": "a#" + start,
      ":end": "a#" + end
    }
  };

  const dbResult = await documentClient.query(params).promise();

  return dbResult.Items.map(res => new Date(res.sk.substr(2)));
}