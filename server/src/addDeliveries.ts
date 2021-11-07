import 'source-map-support/register'
import { Delivery, MenuItems, Vendor, WeekTime } from './interfaces';
import { getDeliveryDates } from './timeHandling'
import { getOnlySubscriptionForUser } from './dbUtils'

export async function generateDeliveries(EarliestStartDate: Date, userId: string, vendor: string, noOfDeliveries: number): Promise<Delivery[]> {
    let subscription = await getOnlySubscriptionForUser(userId);
    if (!subscription) {
        throw "User " + userId + " does not exist"
    }

    let weekTimes:WeekTime[] = scheduleToWeekTimes(subscription.schedule)

    let deliveryDates = getDeliveryDates(EarliestStartDate, weekTimes, noOfDeliveries);
    return deliveryDates.map((date) => {
        return {
            vendorId: vendor,
            userId,
            deliverytime: date.date.toISOString(),
            menuId: date.menuId!,
            cancelled: false
        }
    });
}

export async function generateDeliveriesForVendor(EarliestStartDate: Date, vendor: Vendor, noOfDeliveries: number): Promise<Delivery[]> {
    let weekTimes:WeekTime[] = scheduleToWeekTimes(vendor.schedule)

    let deliveryDates = getDeliveryDates(EarliestStartDate, weekTimes, noOfDeliveries);
    return deliveryDates.map((date) => {
        return {
            vendorId: vendor.vendorId,
            userId: vendor.vendorId,
            deliverytime: date.date.toISOString(),
            menuId: date.menuId!,
            cancelled: false
        }
    });
}

export function scheduleToWeekTimes(menuItems: MenuItems[]):WeekTime[] {
    return menuItems.map((item) => { 
        const day = dayStringToInt(item.day);
        if (day < 0) {
            throw ("Ugyldig dag")
        }
        return {
            menuId: item.id,
            day: day,
            time: parseInt(item.time)
        }
    });
}

function dayStringToInt(day: string) {
    switch(day) {
        case 'Søndag':
            return 0;
        case 'Mandag':
            return 1;
        case 'Tirsdag':
            return 2;
        case 'Onsdag':
            return 3;
        case 'Torsdag':
            return 4;
        case 'Fredag':
            return 5;
        case 'Lørdag':
            return 6;
    }
    return -1;
}