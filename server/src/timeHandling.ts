import { DateWithMenuId, WeekTime } from '../../common/interfaces';
import { getVendorAbsence, saveAbsenceToDb, setUserAway } from './dbUtils';

export async function getDeliveryDates(startDate: Date, weekTimes: WeekTime[], no:number, env:LunchEnvironment):Promise<DateWithMenuId[]> {
  startDate.setDate(startDate.getDate() - 1);
  let nextDelivery = await nextDeliveryDate(startDate, weekTimes, env);

  let count = 0;
  let deliveryDates: DateWithMenuId[] = [];

  while (count < no) {
    deliveryDates.push(nextDelivery);
    nextDelivery = await nextDeliveryDate(nextDelivery.date, weekTimes, env);
    count++;
  }
  return deliveryDates;
}

export async function getDeliveryDatesQuick(startDate: Date, endDate: Date, weekTimes: WeekTime[]):Promise<DateWithMenuId[]> {
  const absenceDates = await getVendorAbsence(startDate.toISOString(), endDate.toISOString());
  const absenceDateStrings = absenceDates.map( (date) => date.toISOString());

  let nextDelivery = nextDeliveryDateQuick(startDate, weekTimes, absenceDateStrings);

  let deliveryDates: DateWithMenuId[] = [];

  while (nextDelivery.date <= endDate) {
    deliveryDates.push(nextDelivery);
    nextDelivery = nextDeliveryDateQuick(nextDelivery.date, weekTimes, absenceDateStrings);
  }
  return deliveryDates;
}

export async function noOfDeliveriesInMonth(startDate: Date, weekTimes: WeekTime[], env:LunchEnvironment):Promise<number> {
  let nextDelivery = await nextDeliveryDate(startDate, weekTimes, env);
  let count = 0;

  while (nextDelivery.date.getUTCMonth() == startDate.getUTCMonth()) {
    nextDelivery = await nextDeliveryDate(nextDelivery.date, weekTimes, env);
    count++;
  }
  return count;
}

function getDeliveryBeforeMidnight(date: Date, weekTimes: WeekTime[]) {
  let weekTime = toWeekTime(date);
  let i = 0;

  while (i < weekTimes.length && lessThanOrEqual(weekTimes[i], weekTime)) {
    i++;
  }
  if (i < weekTimes.length && weekTimes[i].day === date.getUTCDay()) {    // TODO: Sjekke om det er denne som gjør at om startdate er en leveringsdag så kommer den ikke med
    return weekTimes[i];
  } 
  return null;
}

export async function nextDeliveryDate(date: Date, weekTimes: WeekTime[], env: LunchEnvironment): Promise<DateWithMenuId> {
  if (weekTimes.length == 0) {
    return null;
  }

  let result = await findNextWorkDay(date, env);
  let delivery = getDeliveryBeforeMidnight(result, weekTimes);

  while (delivery === null) {
    result = await findNextWorkDay(result, env);
    delivery = getDeliveryBeforeMidnight(result, weekTimes);
  }

  return { 
    date: result,
    menuId: delivery.menuId
  }
}

export function nextDeliveryDateQuick(date: Date, weekTimes: WeekTime[], absentDates: string[]): DateWithMenuId {
  if (weekTimes.length == 0) {
    return null;
  }
  let result = findNextWorkDayQuick(date, absentDates);
  let delivery = getDeliveryBeforeMidnight(result, weekTimes);

  while (delivery === null) {
    result = findNextWorkDayQuick(result, absentDates);
    delivery = getDeliveryBeforeMidnight(result, weekTimes);
  }

  return { 
    date: result,
    menuId: delivery.menuId
  }
}

function lessThanOrEqual(wt1: WeekTime, wt2: WeekTime) {
  if (wt1.day == wt2.day) {
    return wt1.time <= wt2.time;
  }
  return wt1.day < wt2.day
}

export function toWeekTime(date: Date): WeekTime {
  return {
    day: date.getUTCDay(),
    time: date.getUTCHours() * 3600000 + date.getUTCMinutes() * 60000 + date.getUTCSeconds() * 1000 + date.getUTCMilliseconds()
  }
}

export async function isVendorAbsent(date: Date, env: LunchEnvironment) {
  let absentDates = await env.getVendorAbsence(date, date);
  return (absentDates.length > 0);
}

export async function isUserAbsent(date: Date, env: LunchEnvironment) {
  let absentDates = await env.getUserAbsence(date, date);
  return (absentDates.length > 0);
}

export async function findNextWorkDay(date: Date, env: LunchEnvironment): Promise<Date> {
  let currentDate = new Date(date);

  currentDate.setDate(date.getDate() + 1);

  while (await isVendorAbsent(currentDate, env) || await isUserAbsent(currentDate, env)) {
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return currentDate;
}

export function findNextWorkDayQuick(date: Date, absentDates: string[]): Date {
  let currentDate = new Date(date);

  currentDate.setDate(date.getDate() + 1);

  while (absentDates.includes(currentDate.toISOString())) {
    currentDate.setDate(currentDate.getDate() + 1);
  }
  return currentDate;
}

export async function generateVendorsAbsentDates(start: string, end: string) {
  const absentDates:string[] = [];
  const startDate = new Date(start);
  const endDate = new Date(end);
  let currentDate = startDate;

  while (startDate <= endDate) {
    absentDates.push(new Date(currentDate).toISOString());
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  await saveAbsenceToDb(absentDates);
}

export async function generateUsersAbsentDates(start: string, end: string) {
  const absentDates:string[] = [];
  const startDate = new Date(start);
  const endDate = new Date(end);
  let currentDate = startDate;

  while (startDate <= endDate) {
    absentDates.push(new Date(currentDate).toISOString());
    currentDate.setDate(currentDate.getDate() + 1);
  }
  
  await setUserAway(absentDates);
}