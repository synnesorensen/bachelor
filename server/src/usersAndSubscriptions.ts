import 'source-map-support/register'
import middy from 'middy';
import cors from '@middy/http-cors';
import { APIGatewayProxyEvent, APIGatewayProxyResult } from 'aws-lambda'
import { getAllSubscriptionsFromDb, getAllUsersFromDb, getUserprofileFromDb, getVendorFromDb } from './dbUtils';
import { getUserInfoFromEvent } from './auth/getUserFromJwt';
import { UserDto } from '../../common/dto';

async function handler(event: APIGatewayProxyEvent): Promise<APIGatewayProxyResult> {
    const vendorId = getUserInfoFromEvent(event);
    const vendor = await getUserprofileFromDb(vendorId);
    const { schedule } = await getVendorFromDb();
    
    if (!vendor.isVendor) {
        return {
            statusCode: 403,
            body: JSON.stringify( {message: "User " + vendorId + " is not a vendor"})
        };
    }
    
    const users = await getAllUsersFromDb();
    const subscriptions = await getAllSubscriptionsFromDb(vendorId);

    let result: UserDto[] = [];

    let lastDelDates = new Map()
    subscriptions.forEach( sub => {
        if (sub.lastDeliveryDate) {
            lastDelDates.set(sub.userId, sub.lastDeliveryDate)
        }
    })

    users.forEach(async user => {
        let sub = subscriptions.find(({userId}) => userId === user.email);
        let lastDeliveryDate = "";
        let subSchedule = [];
        if (sub) {
            lastDeliveryDate = lastDelDates.get(sub.userId) ? lastDelDates.get(sub.userId) : undefined;
            sub.schedule.forEach(item => {
                subSchedule.push(schedule.find(({id}) => id === item))
            });
        }
        result.push({
            fullname: user.fullname,
            address: user.address,
            deliveryAddress: user.deliveryAddress,
            phone: user.phone,
            email: user.email, 
            allergies: user.allergies, 
            approved: user.approved,
            isVendor: user.isVendor,
            subscription: sub ? {
                userId: sub.userId,
                vendorId: sub.vendorId,
                paused: sub.paused,
                noOfMeals: sub.noOfMeals,
                box: sub.box,
                lastDeliveryDate,
                schedule: subSchedule
            } : null
        })
    })

    return {
        statusCode: 200,
        body: JSON.stringify(result)
    };
}

export const mainHandler = middy(handler).use(cors());