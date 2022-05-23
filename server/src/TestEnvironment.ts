import { DatabaseMock } from "./tests/newTests/databaseMock";

export class TestEnvironment implements LunchEnvironment {
  private db: DatabaseMock;

  constructor() {
    this.db = new DatabaseMock();
  }

  public addAbsenceDate(date: Date) {
    this.db.addAbsenceDate(date);
  }

  async getVendorAbsence(date1: Date, date2: Date): Promise<Date[]> {
    return this.db.getVendorAbsence(date1,date2);
  }
  
}