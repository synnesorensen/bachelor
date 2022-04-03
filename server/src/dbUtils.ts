import 'source-map-support/register'
import { DynamoDB } from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Subscription, UserSubscription, Userprofile, Delivery, Vendor, DeliveryDetail } from '../../common/interfaces';
import * as settings from '../../common/settings';
import { generateDeliveriesForSubscribers } from './addDeliveries';
import { DeliveryDto, DeliveryRequestDto } from '../../common/dto';

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
  let users: Userprofile[] = await Promise.all(result.Items.map(async (user) => {
    return {
      userId: user.pk.substr(2),
      fullname: user.fullname,
      address: user.address,
      deliveryAddress: user.deliveryAddress,
      phone: user.phone,
      email: user.email,
      allergies: user.allergies ? user.allergies : [],
      approved: user.approved,
      isVendor: user.isVendor
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

export async function updateApproval(userId: string, approved: boolean): Promise<void> {
  let UpdateExpression = "set approved = :approved";
  let ExpressionAttributeValues: any = {
    ":approved": { BOOL: approved }
  };

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
    approved: dbResult.Items[0].approved ? dbResult.Items[0].approved : false,
    isVendor: dbResult.Items[0].isVendor
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
      ExpressionAttributeValues[":approved"] = { BOOL: userprofile.approved };
    }
  } else {
    UpdateExpression += ", approved = if_not_exists(approved, :approved)";
    ExpressionAttributeValues[":approved"] = { BOOL: false };
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
  return {
    fullname: userprofile.fullname,
    address: userprofile.address,
    deliveryAddress: dbItem.Attributes.deliveryAddress.S,
    phone: dbItem.Attributes.phone.S,
    email: dbItem.Attributes.email.S,
    allergies: dbItem.Attributes.allergies?.SS,
    approved: dbItem.Attributes.approved?.BOOL || false,
    isVendor: dbItem.Attributes.isVendor.BOOL
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
        ProjectionExpression: "sk, fullname, address, phone, email, allergies, approved"
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
  if (endDate) {
    KeyConditionExpression += "#sk BETWEEN :prefix1 and :prefix2";
  } else {
    KeyConditionExpression += "#sk >= :prefix1";
  }
  let params = {
    TableName: settings.TABLENAME,
    KeyConditionExpression,
    ExpressionAttributeNames: {
      "#pk": "pk",
      "#sk": "sk"
    },
    ExpressionAttributeValues: {
      ":user": "u#" + userId,
      ":prefix1": "d#" + startDate,
      ":prefix2": "d#" + endDate
    }
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
      approved: del.approved
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
      ":user": "u#" + userId,
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
    approved: dbResult.Items[0].approved
  };
}

// Brukes kun av kunde, derfor settes den som ikke godkjent og ikke betalt
export async function putDeliveryInDb(vendorId: string, userId: string, delivery: DeliveryDto): Promise<Delivery> {
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

  UpdateExpression += ", cancelled = :cancelled";
  ExpressionAttributeValues[":cancelled"] = { BOOL: false };

  UpdateExpression += ", approved = :approved";
  ExpressionAttributeValues[":approved"] = { S: "new" };

  UpdateExpression += ", paid = :paid";
  ExpressionAttributeValues[":paid"] = { S: "unpaid" };

  UpdateExpression += ", deliveryType = :deliveryType";
  UpdateExpression += ", GSI1_pk = :deliveryType";
  ExpressionAttributeValues[":deliveryType"] = { S: "single"};

  UpdateExpression += ", GSI2_pk = :vendor";
  ExpressionAttributeValues[":vendor"] = { S: "v#" + vendorId };
  
  UpdateExpression += ", GSI1_sk = :deliverytime";
  UpdateExpression += ", GSI2_sk = :deliverytime";
  ExpressionAttributeValues[":deliverytime"] = { S: "d#" + delivery.deliverytime };

  let params = {
    TableName: settings.TABLENAME,
    Key: {
      "pk": { S: "u#" + userId },
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
    approved
  }
}

export async function deleteDeliveryInDb(userId: string, time: string): Promise<void> {
  let params = {
    TableName: settings.TABLENAME,
    Key: {
      "pk": { S: "u#" + userId },
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
        pk: "u#" + userId,
        sk: "d#" + deliveries[i].deliverytime,
        deliverytime: deliveries[i].deliverytime,
        menuId: deliveries[i].menuId,
        cancelled: deliveries[i].cancelled,
        deliveryType: deliveries[i].deliveryType,
        paid: deliveries[i].paid,
        approved: deliveries[i].approved,
        GSI1_pk: deliveries[i].deliveryType,
        GSI1_sk: "s#" + deliveries[i].deliverytime,
        GSI2_pk: "v#" + deliveries[i].vendorId,
        GSI2_sk: "d#" + deliveries[i].deliverytime
      }
    });
  }
  let promises = [];

  for (let del of dels) {
    promises.push(documentClient.put(del).promise());
  }

  await Promise.all(promises);
}

export async function saveDeliveriesToDb(deliveries: Delivery[]): Promise<void> {
  let dels = [];
  for (let i = 0; i < deliveries.length; i++) {
    dels.push({
      PutRequest: {
        Item: {
          EntityType: "Delivery",
          pk: "u#" + deliveries[i].userId,
          sk: "d#" + deliveries[i].deliverytime,
          userId: deliveries[i].userId,
          vendorId: deliveries[i].vendorId,
          deliverytime: deliveries[i].deliverytime,
          menuId: deliveries[i].menuId,
          cancelled: deliveries[i].cancelled,
          deliveryType: deliveries[i].deliveryType,
          paid: deliveries[i].paid,
          approved: deliveries[i].approved,
          GSI1_pk: deliveries[i].deliveryType,
          GSI1_sk: "d#" + deliveries[i].deliverytime,
          GSI2_pk: "v#" + deliveries[i].vendorId,
          GSI2_sk: "d#" + deliveries[i].deliverytime
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
      ":vendor": "v#" + vendorId,
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
      approved: del.approved
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
      approved: del.approved
    }
  });
  const deliveryRequests: DeliveryRequestDto[] = [];
  const promises = [];
  deliveries.forEach(del => {
    promises.push(getUserprofileFromDb(del.userId));
  });

  const userprofiles = await Promise.all(promises);
  deliveries.forEach(del => {
    const user = userprofiles.find(({email}) => email === del.userId);
    const deliveryReq:DeliveryRequestDto = {
      ...del,
      fullname: user.fullname,
      deliveryAddress: user.deliveryAddress,
      allergies: user.allergies
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
      approved: del.approved
    }
  });

  const deliveryRequests: DeliveryRequestDto[] = [];
  const promises = [];
  deliveries.forEach(del => {
    promises.push(getUserprofileFromDb(del.userId));
  });

  const userprofiles = await Promise.all(promises);
  deliveries.forEach(del => {
    const user = userprofiles.find(({email}) => email === del.userId);
    const deliveryReq:DeliveryRequestDto = {
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
  let params = {
    TableName: settings.TABLENAME,
    Limit: 1,
    ScanIndexForward: false,
    KeyConditionExpression: "#pk = :user and begins_with(#sk, :prefix)",
    ExpressionAttributeNames: {
      "#pk": "pk",
      "#sk": "sk"
    },
    ExpressionAttributeValues: {
      ":user": "u#" + userId,
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
    approved: dbResult.Items[0].approved
  }
}

export async function getDeliveryDetails(vendorId: string, startDate: string, endDate: string): Promise<DeliveryDetail[]> {
  const deliveries = await getAllDeliveriesFromAllSubscribers(vendorId, startDate, endDate);
  const userSubscriptions = await getSubscriptionsForVendor(vendorId);
  const deliveryDetails: DeliveryDetail[] = [];
  deliveries.forEach(del => {
    let sub = userSubscriptions!.find(({ userId }) => userId == del.userId);
    if (sub) {
      const deliveryDetail: DeliveryDetail = {
        ...del,
        paused: sub.paused,
        noOfMeals: sub.noOfMeals,
        box: sub.box,
        fullname: sub.fullname,
        address: sub.address,
        phone: sub.phone,
        email: sub.email,
        allergies: sub.allergies
      }
      deliveryDetails.push(deliveryDetail);
    }
  });
  return deliveryDetails;
}
export async function cancelDeliveries(userId: string, deliveries: Delivery[]): Promise<number> {
  if (deliveries.length < 1) {
    return 0;
  }
  const promises: Promise<boolean>[] = [];
  for (let delivery of deliveries) {
    if (delivery.userId == userId || delivery.vendorId == userId) {
      promises.push(cancelDelivery(delivery));
    } else {
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

async function cancelDelivery(delivery: Delivery): Promise<boolean> {
  const dbDel = await getDeliveryFromDb(delivery.vendorId, delivery.userId, delivery.deliverytime);
  if (!dbDel || dbDel.cancelled) {
    return false;
  }
  let UpdateExpression = "set cancelled = :cancelled";
  let ExpressionAttributeValues: any = {
    ":cancelled": { BOOL: true }
  };
  const params = {
    TableName: settings.TABLENAME,
    Key: {
      "pk": { S: "u#" + delivery.vendorId },
      "sk": { S: "d#" + delivery.deliverytime }
    },
    UpdateExpression,
    ExpressionAttributeValues
  };
  await database.updateItem(params).promise();

  // Moving cancelled delivery to the end of period:
  const latestDel = await findLatestDelivery(delivery.vendorId, delivery.userId);
  const date = new Date(latestDel.deliverytime);
  let movedDels = await generateDeliveriesForSubscribers(date, delivery.userId, delivery.vendorId, 1);
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
  let deliveries = await generateDeliveriesForSubscribers(date, userId, vendorId, outstandingDeliveries);
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
      "pk": { S: "u#" + userId },
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
    paid: result.Attributes.paid,
    approved: result.Attributes.approved
  }
}