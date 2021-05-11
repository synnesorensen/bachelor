"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    Object.defineProperty(o, k2, { enumerable: true, get: function() { return m[k]; } });
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.findLatestDelivery = exports.getAllDeliveriesFromAllSubscribers = exports.saveDeliveriesToDb = exports.deleteDeliveryInDb = exports.putDeliveryInDb = exports.getDeliveryFromDb = exports.getUsersDeliveries = exports.getSubscriptionsForUser = exports.getSubscriptionsForVendor = exports.deleteUserprofileInDb = exports.putUserprofileInDb = exports.getUserprofileFromDb = exports.deleteVendorInDb = exports.putVendorInDb = exports.getVendorFromDb = exports.deleteSubscriptionInDb = exports.putSubscriptionInDb = exports.getSubscriptionFromDb = void 0;
require("source-map-support/register");
const aws_sdk_1 = require("aws-sdk");
const dynamodb_1 = require("aws-sdk/clients/dynamodb");
const settings = __importStar(require("../../common/settings"));
const database = new aws_sdk_1.DynamoDB({ region: settings.REGION });
const documentClient = new dynamodb_1.DocumentClient({ region: settings.REGION });
async function getSubscriptionFromDb(vendorId, userId) {
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
    };
    let subscriptionResult = await documentClient.query(subscriptionParams).promise();
    if (subscriptionResult.Items.length == 0) {
        return undefined;
    }
    return {
        vendorId,
        userId,
        approved: subscriptionResult.Items[0].approved ? subscriptionResult.Items[0].approved : false,
        paused: subscriptionResult.Items[0].paused,
        schedule: subscriptionResult.Items[0].schedule.values,
        noOfMeals: subscriptionResult.Items[0].noOfMeals,
        box: subscriptionResult.Items[0].box
    };
}
exports.getSubscriptionFromDb = getSubscriptionFromDb;
async function putSubscriptionInDb(subscription, isVendor) {
    var _a, _b, _c;
    let UpdateExpression = "set EntityType = :EntityType";
    let ExpressionAttributeValues = {
        ":EntityType": { S: 'Subscription' }
    };
    if (isVendor) {
        if (subscription.approved != undefined) {
            UpdateExpression += ", approved = :approved";
            ExpressionAttributeValues[":approved"] = { BOOL: subscription.approved };
        }
    }
    else {
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
        approved: ((_a = dbItem.Attributes.approved) === null || _a === void 0 ? void 0 : _a.BOOL) || false,
        paused: ((_b = dbItem.Attributes.paused) === null || _b === void 0 ? void 0 : _b.BOOL) || false,
        schedule: ((_c = dbItem.Attributes.schedule) === null || _c === void 0 ? void 0 : _c.SS) || [],
        noOfMeals: parseInt(dbItem.Attributes.noOfMeals.N),
        box: dbItem.Attributes.box.S
    };
}
exports.putSubscriptionInDb = putSubscriptionInDb;
async function deleteSubscriptionInDb(vendorId, userId) {
    let params = {
        TableName: settings.TABLENAME,
        Key: {
            'pk': { S: 'v#' + vendorId },
            'sk': { S: 'u#' + userId }
        }
    };
    await database.deleteItem(params).promise();
}
exports.deleteSubscriptionInDb = deleteSubscriptionInDb;
async function getVendorFromDb(vendorId) {
    let params = {
        TableName: settings.TABLENAME,
        KeyConditionExpression: "#pk = :vendorId and #sk = :vendorId",
        ExpressionAttributeNames: {
            "#pk": "pk",
            "#sk": "sk"
        },
        ExpressionAttributeValues: {
            ":vendorId": "v#" + vendorId
        }
    };
    let dbResult = await documentClient.query(params).promise();
    if (dbResult.Items.length == 0) {
        return undefined;
    }
    return {
        company: dbResult.Items[0].company,
        fullname: dbResult.Items[0].fullname,
        address: dbResult.Items[0].address,
        phone: dbResult.Items[0].phone,
        email: dbResult.Items[0].email,
        schedule: dbResult.Items[0].schedule
    };
}
exports.getVendorFromDb = getVendorFromDb;
async function putVendorInDb(vendor, vendorId) {
    let params = {
        TableName: settings.TABLENAME,
        Item: {
            pk: "v#" + vendorId,
            sk: "v#" + vendorId,
            EntityType: "Vendor",
            company: vendor.company,
            fullname: vendor.fullname,
            address: vendor.address,
            phone: vendor.phone,
            email: vendor.email,
            schedule: vendor.schedule
        }
    };
    await documentClient.put(params).promise();
    return {
        company: vendor.company,
        fullname: vendor.fullname,
        address: vendor.address,
        phone: vendor.phone,
        email: vendor.email,
        schedule: vendor.schedule
    };
}
exports.putVendorInDb = putVendorInDb;
async function deleteVendorInDb(vendorId) {
    let params = {
        TableName: settings.TABLENAME,
        Key: {
            'pk': { S: 'v#' + vendorId },
            'sk': { S: 'v#' + vendorId }
        }
    };
    await database.deleteItem(params).promise();
}
exports.deleteVendorInDb = deleteVendorInDb;
async function getUserprofileFromDb(userId) {
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
        phone: dbResult.Items[0].phone,
        email: dbResult.Items[0].email,
        allergies: dbResult.Items[0].allergies,
        isVendor: dbResult.Items[0].isVendor
    };
}
exports.getUserprofileFromDb = getUserprofileFromDb;
async function putUserprofileInDb(userprofile, userId) {
    let params = {
        TableName: settings.TABLENAME,
        Item: {
            pk: "u#" + userId,
            sk: "u#" + userId,
            EntityType: "Userprofile",
            fullname: userprofile.fullname,
            address: userprofile.address,
            phone: userprofile.phone,
            email: userprofile.email,
            allergies: userprofile.allergies,
            isVendor: userprofile.isVendor
        }
    };
    await documentClient.put(params).promise();
    return {
        fullname: userprofile.fullname,
        address: userprofile.address,
        phone: userprofile.phone,
        email: userprofile.email,
        allergies: userprofile.allergies,
        isVendor: userprofile.isVendor
    };
}
exports.putUserprofileInDb = putUserprofileInDb;
async function deleteUserprofileInDb(userId) {
    let params = {
        TableName: settings.TABLENAME,
        Key: {
            'pk': { S: 'u#' + userId },
            'sk': { S: 'u#' + userId }
        }
    };
    await database.deleteItem(params).promise();
}
exports.deleteUserprofileInDb = deleteUserprofileInDb;
async function getSubscriptionsForVendor(vendorId) {
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
            approved: item.approved,
            paused: item.paused,
            schedule: item.schedule.values,
            noOfMeals: item.noOfMeals,
            box: item.box
        };
    });
    let keys = dbResult.Items.map((item) => {
        return {
            "pk": item.sk,
            "sk": item.sk
        };
    });
    let userSubscriptionParams = {
        RequestItems: {
            [settings.TABLENAME]: {
                Keys: keys,
                ProjectionExpression: "sk, fullname, address, phone, email, allergies"
            }
        }
    };
    let users = await documentClient.batchGet(userSubscriptionParams).promise();
    let subshash = new Map();
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
    };
    let vendorResult = await documentClient.query(vendorParams).promise();
    if (vendorResult.Items.length == 0) {
        return undefined;
    }
    let vendorSchedule = vendorResult.Items[0].schedule;
    let result = await Promise.all(users.Responses[settings.TABLENAME].map(async (user) => {
        var _a;
        let sub = subshash.get(user.sk);
        let userSchedule = vendorSchedule.filter((item) => sub.schedule.includes(item.id));
        return {
            vendorId: sub.vendorId,
            userId: sub.userId.substr(2),
            approved: sub.approved,
            paused: sub.paused,
            schedule: userSchedule,
            noOfMeals: sub.noOfMeals,
            box: sub.box,
            fullname: user.fullname,
            address: user.address,
            phone: user.phone,
            email: user.email,
            allergies: user.allergies,
            lastDeliveryDate: (_a = (await findLatestDelivery(sub.vendorId, sub.userId.substr(2)))) === null || _a === void 0 ? void 0 : _a.deliverytime.substr(0, 10)
        };
    }));
    return result;
}
exports.getSubscriptionsForVendor = getSubscriptionsForVendor;
async function getSubscriptionsForUser(userId) {
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
    if (dbResult.Items.length == 0) {
        return undefined;
    }
    let subs = await Promise.all(dbResult.Items.map(async (item) => {
        return {
            vendorId: item.pk,
            userId,
            approved: item.approved,
            paused: item.paused,
            schedule: item.schedule.values,
            noOfMeals: item.noOfMeals,
            box: item.box
        };
    }));
    let keys = dbResult.Items.map((item) => {
        return {
            "pk": item.pk,
            "sk": item.pk
        };
    });
    let params2 = {
        RequestItems: {
            [settings.TABLENAME]: {
                Keys: keys,
                ProjectionExpression: "pk, company, schedule"
            }
        }
    };
    let vendors = await documentClient.batchGet(params2).promise();
    let subhash = new Map();
    subs.forEach((sub) => {
        subhash.set(sub.vendorId, sub);
    });
    let result = await Promise.all(vendors.Responses[settings.TABLENAME].map(async (vendor) => {
        var _a;
        let sub = subhash.get(vendor.pk);
        let menuHash = new Map();
        vendor.schedule.forEach((item) => {
            menuHash.set(item.id, item);
        });
        let subSchedule = [];
        sub.schedule.forEach((item) => {
            subSchedule.push(menuHash.get(item));
        });
        return {
            vendorId: sub.vendorId.substr(2),
            company: vendor.company,
            approved: sub.approved,
            paused: sub.paused,
            schedule: subSchedule,
            noOfMeals: sub.noOfMeals,
            box: sub.box,
            lastDeliveryDate: (_a = (await findLatestDelivery(sub.vendorId.substr(2), userId))) === null || _a === void 0 ? void 0 : _a.deliverytime
        };
    }));
    return result;
}
exports.getSubscriptionsForUser = getSubscriptionsForUser;
async function getUsersDeliveries(userId, startDate, endDate) {
    let params = {
        TableName: settings.TABLENAME,
        IndexName: "GSI2",
        KeyConditionExpression: "#GSI2_pk = :user and #GSI2_sk BETWEEN :prefix1 and :prefix2",
        ExpressionAttributeNames: {
            "#GSI2_pk": "GSI2_pk",
            "#GSI2_sk": "GSI2_sk"
        },
        ExpressionAttributeValues: {
            ":user": "u#" + userId,
            ":prefix1": startDate,
            ":prefix2": endDate
        }
    };
    let dbResult = await documentClient.query(params).promise();
    let deliveries = dbResult.Items.map((del) => {
        return {
            userId,
            deliverytime: del.deliverytime,
            menuId: del.menuId,
            cancelled: del.cancelled
        };
    });
    return deliveries;
}
exports.getUsersDeliveries = getUsersDeliveries;
async function getDeliveryFromDb(vendorId, userId, time) {
    let params = {
        TableName: settings.TABLENAME,
        KeyConditionExpression: "#pk = :vendor and begins_with(#sk, :prefix)",
        ExpressionAttributeNames: {
            "#pk": "pk",
            "#sk": "sk"
        },
        ExpressionAttributeValues: {
            ":vendor": "v#" + vendorId,
            ":prefix": "d#" + time + "#u#" + userId
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
        cancelled: dbResult.Items[0].cancelled
    };
}
exports.getDeliveryFromDb = getDeliveryFromDb;
async function putDeliveryInDb(vendorId, userId, delivery) {
    let UpdateExpression = "set EntityType = :EntityType";
    let ExpressionAttributeValues = {
        ":EntityType": { S: "Delivery" }
    };
    if (delivery.userId != undefined) {
        UpdateExpression += ", userId = :userId";
        ExpressionAttributeValues[":userId"] = { S: delivery.userId };
    }
    if (delivery.cancelled != undefined) {
        UpdateExpression += ", cancelled = :cancelled";
        ExpressionAttributeValues[":cancelled"] = { BOOL: delivery.cancelled };
    }
    if (delivery.menuId != undefined) {
        UpdateExpression += ", menuId = :menuId";
        ExpressionAttributeValues[":menuId"] = { S: delivery.menuId };
    }
    if (delivery.deliverytime != undefined) {
        UpdateExpression += ", deliverytime = :time";
        ExpressionAttributeValues[":time"] = { S: delivery.deliverytime };
    }
    UpdateExpression += ", GSI2_pk = :userId";
    ExpressionAttributeValues[":userId"] = { S: "u#" + delivery.userId };
    UpdateExpression += ", GSI2_sk = :deliverytime";
    ExpressionAttributeValues[":deliverytime"] = { S: delivery.deliverytime };
    UpdateExpression += ", GSI1_pk = :userAndVendor";
    ExpressionAttributeValues[":userAndVendor"] = { S: "u#" + delivery.userId + "#v#" + delivery.vendorId };
    UpdateExpression += ", GSI1_sk = :deliverytime";
    ExpressionAttributeValues[":deliverytime"] = { S: delivery.deliverytime };
    let params = {
        TableName: settings.TABLENAME,
        Key: {
            "pk": { S: "v#" + vendorId },
            "sk": { S: "d#" + delivery.deliverytime + "#u#" + userId }
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
        cancelled: dbItem.Attributes.cancelled.BOOL
    };
}
exports.putDeliveryInDb = putDeliveryInDb;
async function deleteDeliveryInDb(vendorId, userId, time) {
    let params = {
        TableName: settings.TABLENAME,
        Key: {
            "pk": { S: "v#" + vendorId },
            "sk": { S: "d#" + time + "#u#" + userId }
        }
    };
    await database.deleteItem(params).promise();
}
exports.deleteDeliveryInDb = deleteDeliveryInDb;
async function saveDeliveriesToDb(deliveries) {
    let dels = [];
    for (let i = 0; i < deliveries.length; i++) {
        dels.push({
            PutRequest: {
                Item: {
                    EntityType: "Delivery",
                    pk: "v#" + deliveries[i].vendorId,
                    sk: "d#" + deliveries[i].deliverytime + "#u#" + deliveries[i].userId,
                    deliverytime: deliveries[i].deliverytime,
                    menuId: deliveries[i].menuId,
                    cancelled: deliveries[i].cancelled,
                    GSI2_pk: "u#" + deliveries[i].userId,
                    GSI2_sk: deliveries[i].deliverytime,
                    GSI1_pk: "u#" + deliveries[i].userId + "#v#" + deliveries[i].vendorId,
                    GSI1_sk: deliveries[i].deliverytime
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
        }
    }
    if (dels.length > 0) {
        let params = {
            RequestItems: {
                [settings.TABLENAME]: dels
            }
        };
        await documentClient.batchWrite(params).promise();
    }
}
exports.saveDeliveriesToDb = saveDeliveriesToDb;
async function getAllDeliveriesFromAllSubscribers(vendorId, startTime, endTime) {
    let endDate = new Date(endTime);
    endDate.setDate(endDate.getDate() + 1);
    let nextDay = endDate.toISOString().substr(0, 10);
    let params = {
        TableName: settings.TABLENAME,
        KeyConditionExpression: "#pk = :vendor and #sk BETWEEN :start and :end",
        ExpressionAttributeNames: {
            "#pk": "pk",
            "#sk": "sk"
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
            userId: del.GSI2_pk.substr(2),
            deliverytime: del.deliverytime,
            menuId: del.menuId,
            cancelled: del.cancelled
        };
    });
    return deliveries;
}
exports.getAllDeliveriesFromAllSubscribers = getAllDeliveriesFromAllSubscribers;
async function findLatestDelivery(vendorId, userId) {
    let params = {
        TableName: settings.TABLENAME,
        IndexName: "GSI1",
        Limit: 1,
        ScanIndexForward: false,
        KeyConditionExpression: "#GSI1_pk = :userAndVendor",
        ExpressionAttributeNames: {
            "#GSI1_pk": "GSI1_pk"
        },
        ExpressionAttributeValues: {
            ":userAndVendor": "u#" + userId + "#v#" + vendorId
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
        cancelled: dbResult.Items[0].cancelled
    };
}
exports.findLatestDelivery = findLatestDelivery;
//# sourceMappingURL=dbUtils.js.map