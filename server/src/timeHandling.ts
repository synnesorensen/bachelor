import { MenuItems, WeekTime } from './interfaces'

export function nextWeekTime(date: Date, weekTimes: WeekTime[]): Date {
    let weekTime = toWeekTime(date);
    let i = 0;
    while (lessThan(weekTimes[i], weekTime)) {
        i++;
    }
    const millisPerDay = 1000 * 3600 * 24;
    let delta = ((weekTimes[i].day - weekTime.day) * millisPerDay) + (weekTimes[i].time - weekTime.time);
    return new Date(date.getMilliseconds() + delta);
}

function lessThan(wt1: WeekTime, wt2: WeekTime) {
    if (wt1.day == wt2.day) {
        return wt1.time < wt2.time;
    }
    return wt1.day < wt2.day
}

export function toWeekTime(date: Date): WeekTime {

    return {
        day: date.getDay(),
        time: date.getHours() * 3600000 + date.getMinutes() * 60000 + date.getSeconds() * 1000
    }
}


