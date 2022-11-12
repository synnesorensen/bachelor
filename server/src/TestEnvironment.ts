import { DatabaseMock } from "./tests/newTests/DatabaseMock";

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

  async getUserAbsence(date1: Date, date2: Date): Promise<Date[]> {
    return this.db.getUserAbsence(date1, date2);
  }

  
}