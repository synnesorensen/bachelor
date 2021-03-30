import { DynamoDB } from 'aws-sdk';
import { DocumentClient } from 'aws-sdk/clients/dynamodb';
import { Subscription, UserSubscription, Userprofile, Delivery, Vendor } from './interfaces';

const database = new DynamoDB({ region: 'eu-north-1' });
const documentClient = new DocumentClient({ region: 'eu-north-1' });

export async function getUserSubscriptionFromDb(vendorId: string, userId: string): Promise<Subscription | undefined> {
    let params = {
        TableName: 'MainTable',
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

export async function putSubscriptionInDb(subscription: Subscription): Promise<Subscription> {
    let UpdateExpression = "set EntityType = :EntityType";
    let ExpressionAttributeValues: any = {
        ":EntityType": { S: 'Subscription' }
    }; 

    if (subscription.approved != undefined) {
        UpdateExpression += ", approved = :approved";
        ExpressionAttributeValues[":approved"] = { BOOL: subscription.approved };
    }

    if (subscription.paused != undefined) {
        UpdateExpression += ", paused = :paused";
        ExpressionAttributeValues[":paused"] = { BOOL: subscription.paused };
    }

    if (subscription.schedule) {
        UpdateExpression += ", schedule = :schedule";
        ExpressionAttributeValues[":schedule"] = { SS: subscription.schedule };
    }

    let params = {
        TableName: 'MainTable',
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
        schedule: dbItem.Attributes.schedule?.SS || []
    };
}

export async function deleteUserSubscriptionInDb(vendorId: string, userId: string): Promise<void> {
    let params = {
        TableName: 'MainTable',
        Key: {
            'pk': { S: 'v#' + vendorId },
            'sk': { S: 'u#' + userId }  
        }
    };
    await database.deleteItem(params).promise();
}

export async function getUserprofileFromDb(userId): Promise<Userprofile> {
    let params = {
        TableName: 'MainTable',
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
        email: dbResult.Items[0].email
    };  
}

export async function putUserprofileInDb(userprofile: Userprofile, userId: string): Promise<Userprofile> {
    let UpdateExpression = "set EntityType = :EntityType, fullname = :fullname, address = :address, phone = :phone, email = :email";
    let ExpressionAttributeValues: any = {
        ":EntityType": { S: 'Userprofile' },
        ":fullname": { S: userprofile.fullname },
        ":address": { S: userprofile.address },
        ":phone": { S: userprofile.phone },
        ":email": { S: userprofile.email }
    }; 

    let params = {
        TableName: "MainTable",
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
    }
} 

export async function deleteUserprofileInDb(userId: string): Promise<void> {
    let params = {
        TableName: 'MainTable',
        Key: {
            'pk': { S: 'u#' + userId },
            'sk': { S: 'u#' + userId }
        }
    };
    await database.deleteItem(params).promise();
}

export async function getVendorSubscriptionsFromDb(vendorId: string): Promise<Subscription[]> {
    let params = {
        TableName: 'MainTable',
        KeyConditionExpression: "#pk = :vendor and begins_with(#sk, :prefix)",
        ExpressionAttributeNames: {
            "#pk": "pk",
            "#sk": "sk"
        },
        ExpressionAttributeValues: {
            ":vendor": "v#" + vendorId,
            ":prefix": "c#"
        }
    };

    let dbResult = await documentClient.query(params).promise();
    return dbResult.Items.map((item) => {
        return {
            vendorId,
            userId: item.sk.substr(2),
            approved: item.approved,
            paused:item.paused,
            schedule: item.schedule
        }
    });

}