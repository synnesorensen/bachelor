import 'source-map-support/register'
import { DynamoDB } from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Subscription, UserSubscription, Userprofile, Delivery, Vendor, CompanySubscription } from './interfaces';
import * as settings from './settings';

const database = new DynamoDB({ region: settings.REGION });
const documentClient = new DocumentClient({ region: settings.REGION });

export async function getSubscriptionFromDb(vendorId: string, userId: string): Promise<Subscription | undefined> {
    let params = {
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
    let dbResult = await documentClient.query(params).promise();
    if (dbResult.Items.length == 0) {
        return undefined;
    }
    return {
        userId,
        approved: dbResult.Items[0].approved? dbResult.Items[0].approved : false,
        paused: dbResult.Items[0].paused,
        schedule: dbResult.Items[0].schedule
    };   
}

export async function putSubscriptionInDb(subscription: Subscription, isVendor: boolean): Promise<Subscription> {
    let UpdateExpression = "set EntityType = :EntityType";
    let ExpressionAttributeValues: any = {
        ":EntityType": { S: 'Subscription' }
    }; 

    if (isVendor) {
        if (subscription.approved != undefined) {
            UpdateExpression += ", approved = :approved";
            ExpressionAttributeValues[":approved"] = { BOOL: subscription.approved };
        }
    } else {
        UpdateExpression += ", approved = if_not_exists(approved, :approved)";
        ExpressionAttributeValues[":approved"] = { BOOL: false };
    }    

    if (subscription.paused != undefined) {
        UpdateExpression += ", paused = :paused";
        ExpressionAttributeValues[":paused"] = { BOOL: subscription.paused };
    }

    if (subscription.schedule) {
        UpdateExpression += ", schedule = :schedule";
        ExpressionAttributeValues[":schedule"] = { SS: subscription.schedule };
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
        approved: dbItem.Attributes.approved?.BOOL || false,
        paused: dbItem.Attributes.paused?.BOOL || false,
        schedule: dbItem.Attributes.schedule?.SS || [],
    };
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

export async function getUserprofileFromDb(userId): Promise<Userprofile> {
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
    }
    let dbResult = await documentClient.query(params).promise();
    if (dbResult.Items.length == 0) {
        return undefined;
    }
    return {
        fullname: dbResult.Items[0].fullname,
        address: dbResult.Items[0].address,
        phone: dbResult.Items[0].phone,
        email: dbResult.Items[0].email, 
        allergies: dbResult.Items[0].allergies
    };  
}

export async function putUserprofileInDb(userprofile: Userprofile, userId: string): Promise<Userprofile> {
    let UpdateExpression = "set EntityType = :EntityType, fullname = :fullname, address = :address, phone = :phone, email = :email, allergies = :allergies";
    let ExpressionAttributeValues: any = {
        ":EntityType": { S: 'Userprofile' },
        ":fullname": { S: userprofile.fullname },
        ":address": { S: userprofile.address },
        ":phone": { S: userprofile.phone },
        ":email": { S: userprofile.email },
        ":allergies": { SS: userprofile.allergies}
    }; 

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
        fullname: dbItem.Attributes.fullname.S,
        address: dbItem.Attributes.address.S,
        phone: dbItem.Attributes.phone.S,
        email: dbItem.Attributes.email.S,
        allergies: dbItem.Attributes.allergies.SS
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

export async function getSubscriptionsForVendor(vendorId: string): Promise<UserSubscription[]> {
    let subparams = {
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

    let dbResult = await documentClient.query(subparams).promise();
    let subs = dbResult.Items.map((item) => {
        return {
            vendorId,
            userId: item.sk,
            approved: item.approved,
            paused:item.paused,
            schedule: item.schedule
        }
    });

    let keys = dbResult.Items.map((item) => {
        return {
            "pk": {S: item.sk},         // her må sk fra subscription brukes for å finne
            "sk": {S: item.sk}          // userprofile sin composite key
        }
    });

    let usersubparams = {
        RequestItems: {
            [settings.TABLENAME]: {
                Keys: keys,
                ProjectionExpression: "sk, fullname, address, phone, email, allergies"
            }
        }
    };
    let users = await database.batchGetItem(usersubparams).promise();
    
    let subshash = new Map<string, Subscription>();

    subs.forEach((sub) => {
        subshash.set(sub.userId, sub);
    });

    let result:UserSubscription[] = users.Responses[settings.TABLENAME].map(user => {
        let sub = subshash.get(user.sk.S);
        return {
            vendorId: sub.vendorId,
            userId: sub.userId.substr(2),
            approved: sub.approved,
            paused: sub.paused,
            schedule: sub.schedule,
            fullname: user.fullname?.S,
            address: user.address?.S,
            phone: user.phone?.S,
            email: user.email?.S,
            allergies: user.allergies?.SS
        }
    });
    return result;
}

export async function getSubscriptionsForUser(userId: string): Promise<CompanySubscription[]> {
    let params = {
        TableName: settings.TABLENAME,
        IndexName: "GSI1",
        KeyConditionExpression: "#GSI1_pk = :user and begins_with(#GSI1_sk, :prefix)",
        ExpressionAttributeNames: {
            "#GSI1_pk": "GSI1_pk",
            "#GSI1_sk": "GSI1_sk"
        },
        ExpressionAttributeValues: {
            ":user": "u#" + userId,
            ":prefix": "v#"
        }
    };

    let dbResult = await documentClient.query(params).promise();
    let subs = dbResult.Items.map((item) => {
        return {
            vendorId: item.pk,
            userId,
            approved: item.approved,
            paused: item.paused,
            schedule: item.schedule
        }
    });

    let keys = dbResult.Items.map((item) => {
        return {
            "pk": {S: item.pk},
            "sk": {S: item.pk}
        }
    }); 

    let params2 = {
        RequestItems: {
            [settings.TABLENAME]: {
                Keys: keys,
                ProjectionExpression: "pk, company"
            }
        }
    };

    let vendors = await database.batchGetItem(params2).promise();

    let subhash = new Map<String, Subscription>();

    subs.forEach((sub) => {
        subhash.set(sub.vendorId, sub);
    });

    let result:CompanySubscription[] = vendors.Responses[settings.TABLENAME].map((vendor) => {
        let sub = subhash.get(vendor.pk.S);
        return {
            vendorId: sub.vendorId.substr(2),
            company: vendor.company.S,
            approved: sub.approved,
            paused: sub.paused,
            schedule: sub.schedule
        }
    });
    return result;
}

export async function getUsersDeliveries(vendorId: string, userId: string, startDate: string, endDate: string): Promise<Delivery[]> {
    let params = {
        TableName: settings.TABLENAME,
        KeyConditionExpression: "#pk = :vendor and #sk BETWEEN :prefix1 and :prefix2",
        ExpressionAttributeNames: {
            "#pk": "pk",
            "#sk": "sk"
        },
        ExpressionAttributeValues: {
            ":vendor": "v#" + vendorId,
            ":prefix1": "u#" + userId + "#" + startDate,
            ":prefix2": "u#" + userId + "#" + endDate
        }
    };

    let dbResult = await documentClient.query(params).promise();

    let deliveries = dbResult.Items.map((del) => {
        return {
            time: del.date,
            menu: del.menu,
            cancelled: del.cancelled
        }
    });
    return deliveries;
}

export async function getDeliveryFromDb(vendorId: string, userId: string, time: string) {
    let params = {
        TableName: settings.TABLENAME,
        KeyConditionExpression: "#pk = :vendor and begins_with(#sk, :prefix)",
        ExpressionAttributeNames: {
            "#pk": "pk",
            "#sk": "sk"
        },
        ExpressionAttributeValues: {
            ":vendor": "v#" + vendorId,
            ":prefix": "u#" + userId + "#" + time
        }
    };
    let dbResult = await documentClient.query(params).promise();
    if (dbResult.Items.length == 0) {
        return undefined;
    }
    return {
        time: dbResult.Items[0].time,
        menu: dbResult.Items[0].menu,
        cancelled: dbResult.Items[0].cancelled
    };
}

export async function putDeliveryInDb(vendorId: string, userId: string, delivery: Delivery) {
    let UpdateExpression = "set cancelled = :cancelled";
    let ExpressionAttributeValues: any = {
        ":cancelled": { BOOL: delivery.cancelled}
    }

    let params = {
        TableName: settings.TABLENAME,
        Key: {
            "pk": { S: "v#" + vendorId },
            "sk": { S: "u#" + userId + "#" + delivery.time}
        },
        UpdateExpression,
        ExpressionAttributeValues,
        ReturnValues: "ALL_NEW"
    };

    let dbItem = await database.updateItem(params).promise();
    return {
        time: dbItem.Attributes.time.S,
        menu: dbItem.Attributes.menu.S,
        cancelled: dbItem.Attributes.cancelled.BOOL
    }
}

export async function deleteDeliveryInDb(vendorId: string, userId: string, time: string) {
    let params = {
        TableName: settings.TABLENAME,
        Key: {
            "pk": { S: "v#" + vendorId },
            "sk": { S: "u#" + userId + "#" + time}
        }
    };
    await database.deleteItem(params).promise();
}
