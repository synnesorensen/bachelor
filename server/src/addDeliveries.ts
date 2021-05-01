import 'source-map-support/register'
import { getSubscriptionsForUser } from './dbUtils';
import { Delivery } from './interfaces';

export async function addDeliveries(userId: string, vendor: string, noOfDeliveries: number): Promise<Delivery[]> {
    const subscriptions = await getSubscriptionsForUser(userId);
    const relevantSubscription = subscriptions.find( ({vendorId}) => vendorId === vendor);
    const schedule = relevantSubscription.schedule;
    const deliveryDays:string[] = [];
    let deliveries:Delivery[] = [];
    
    schedule.forEach( (day) => {
        deliveryDays.push(day.day)
    });
    
    
    return deliveries;
}

function getDayOfWeek(date: string) {
    const dayOfWeek = new Date(date).getDay();    
    return isNaN(dayOfWeek) ? null : ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'][dayOfWeek];
}

function addDays(date: Date, days: number) {
    date.setDate(date.getDate() + days);
    return date;
}

function getDates(startDate: Date, stopDate: Date, no: number) {
    let dates: Date[] = [];
    let currentDate = startDate;            // denne må være lastDeliveryDate
    while (currentDate <= stopDate) {
        dates.push(new Date (currentDate));
        currentDate = addDays(currentDate, 1);
    }
    return dates;
}