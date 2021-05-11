"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.scheduleToWeekTimes = exports.generateDeliveries = void 0;
require("source-map-support/register");
const timeHandling_1 = require("./timeHandling");
const dbUtils_1 = require("./dbUtils");
async function generateDeliveries(EarliestStartDate, userId, vendor, noOfDeliveries) {
    let subscriptions = await dbUtils_1.getSubscriptionsForUser(userId);
    if (!subscriptions) {
        throw "User " + userId + " does not exist";
    }
    let subscription = subscriptions.find(({ vendorId }) => vendorId == vendor);
    if (!subscription) {
        throw "User " + userId + " has no subscription for vendor " + vendor;
    }
    let weekTimes = scheduleToWeekTimes(subscription.schedule);
    let deliveryDates = timeHandling_1.getDeliveryDates(EarliestStartDate, weekTimes, noOfDeliveries);
    return deliveryDates.map((date) => {
        return {
            vendorId: vendor,
            userId,
            deliverytime: date.date.toISOString(),
            menuId: date.menuId,
            cancelled: false
        };
    });
}
exports.generateDeliveries = generateDeliveries;
function scheduleToWeekTimes(menuItems) {
    return menuItems.map((item) => {
        const day = dayStringToInt(item.day);
        if (day < 0) {
            throw ("Ugyldig dag");
        }
        return {
            menuId: item.id,
            day: day,
            time: parseInt(item.time)
        };
    });
}
exports.scheduleToWeekTimes = scheduleToWeekTimes;
function dayStringToInt(day) {
    switch (day) {
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
//# sourceMappingURL=addDeliveries.js.map