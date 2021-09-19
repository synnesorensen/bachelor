export function toLocalPresentation(time: string) {
    const delDate = new Date(time);
    return delDate.toLocaleDateString("no-NO", { weekday: 'long', year: 'numeric', month: 'long', day: 'numeric'});
}