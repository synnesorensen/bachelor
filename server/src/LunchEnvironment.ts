interface LunchEnvironment {
  getVendorAbsence(date1: Date,date2: Date): Promise<Date[]>
}