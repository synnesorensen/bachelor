
export class DatabaseMock {
  private absenceDates: Date[] = [];

  constructor() {
  }

  public addAbsenceDate(date: Date) {
    this.absenceDates.push(date);
  }

  getVendorAbsence(date1: Date, date2: Date) {
    let result: Date[] = [];
    const flooredDate1 = this.floorDate(date1).getTime();
    const flooredDate2 = this.floorDate(date2).getTime();

    this.absenceDates.forEach(date => {
      const flooredDate = this.floorDate(date).getTime();
      if (flooredDate1 <= flooredDate && flooredDate <= flooredDate2) {
        result.push(date);
      }
    });
    return result;

    // console.log("Absence", this.absenceDates)
    // return this.absenceDates.some(date => {
    //   return (
    //     date.getDate() === date1.getDate() &&
    //     date.getMonth() === date1.getMonth() &&
    //     date.getFullYear() === date1.getFullYear()
    //   )
    // })
  } 

  getUserAbsence(date1: Date, date2: Date) {
    let result: Date[] = [];
    const flooredDate1 = this.floorDate(date1).getTime();
    const flooredDate2 = this.floorDate(date2).getTime();

    this.absenceDates.forEach(date => {
      const flooredDate = this.floorDate(date).getTime();
      if (flooredDate1 <= flooredDate && flooredDate <= flooredDate2) {
        result.push(date);
      }
    });
    return result;
  }

  private floorDate(date: Date) {
    let result = new Date();
    result.setDate(date.getDate());
    result.setMonth(date.getMonth());
    result.setFullYear(date.getFullYear());

    return result;
  }
};

