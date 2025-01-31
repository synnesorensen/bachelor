import 'source-map-support/register'
import { Delivery, MenuItems, Vendor, WeekTime } from '../../common/interfaces';
import { getDeliveryDates, getDeliveryDatesQuick } from './timeHandling'
import { getSubscriptionFromDb, getVendorFromDb } from './dbUtils'

export async function generateDeliveriesForSubscribers(EarliestStartDate: Date, userId: string, vendorId: string, noOfDeliveries: number, env:LunchEnvironment): Promise<Delivery[]> {
  const subscriptionFromDb = await getSubscriptionFromDb(vendorId, userId);
  if (!subscriptionFromDb) {
    throw "User " + userId + " does not exist"
  }
  const vendor = await getVendorFromDb();
  let subSchedule: MenuItems[] = [];
  subscriptionFromDb.schedule.forEach((item) => {
    subSchedule.push(vendor.schedule.find(({id}) => id === item));
  });

  let weekTimes:WeekTime[] = scheduleToWeekTimes(subSchedule);

  // TODO: Endre til quick
  let deliveryDates = await getDeliveryDates(EarliestStartDate, weekTimes, noOfDeliveries, env);
  const deliveryType: "sub" | "single" = "sub";
  return deliveryDates.map((date) => {
    return {
      vendorId: vendorId,
      userId,
      deliverytime: date.date.toISOString(),
      menuId: date.menuId!,
      cancelled: false, 
      deliveryType,
      paid: "paid",
      approved: "approved",
      noOfMeals: subscriptionFromDb.noOfMeals
    }
  });
}

// Deliveries offered by vendor (yellow events in user's calendar)
export async function generateDeliveriesForVendor(EarliestStartDate: Date, endDate: Date, vendor: Vendor): Promise<Delivery[]> {
  let weekTimes:WeekTime[] = scheduleToWeekTimes(vendor.schedule)

  let deliveryDates = await getDeliveryDatesQuick(EarliestStartDate, endDate, weekTimes);
  const deliveryType: "sub" | "single" = "single";

  return deliveryDates.map((date) => {
    return {
      vendorId: vendor.vendorId,
      userId: vendor.vendorId,            // Changes when someone orders the delivery
      deliverytime: date.date.toISOString(),
      menuId: date.menuId!,
      cancelled: false,
      deliveryType,
      paid: "unpaid",
      approved: "new",
      noOfMeals: 1
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