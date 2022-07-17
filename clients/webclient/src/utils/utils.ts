export function toLocalPresentation(time: string) {
  const delDate = new Date(time);
  return delDate.toLocaleDateString("no-NO", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'});
}

export function getMonth(month: string) {

  var objDate = new Date();
  objDate.setDate(1);
  objDate.setMonth(parseInt(month)-1);

  var locale = "no-NO", 
    month = objDate.toLocaleString(locale, { month: "long" });

    return month;
}