import { getVendorAbsence } from "./dbUtils";

export class DbEnvironment implements LunchEnvironment {

  async getVendorAbsence(date1: Date, date2: Date): Promise<Date[]> {
    return await getVendorAbsence(date1.toISOString(), date2.toISOString());
  }

}

export const dbenv = new DbEnvironment();