export interface LunchEnvironment {
  getUserAbsence(date1: Date, date2: Date): Promise<Date[]>
  getVendorAbsence(date1: Date,date2: Date): Promise<Date[]>
}