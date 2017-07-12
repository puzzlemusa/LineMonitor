export interface IDateInfo {
    _id: string;
    lineId: string;
    date: Date;
    productionHour: number;
    goal: number;
    workers: number;
    minutesPerProduct: number;
    planEfficiency: number;
    planDHULevel: number;
}