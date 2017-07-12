import {Injectable} from "@angular/core";

@Injectable()
export class HourToEngConverter {

    public getEngFromHour(hour: number) : string{
        switch (hour) {
            case 8:
                return "1st";
            case 9:
                return "2nd";
            case 10:
                return "3rd";
            case 11:
                return "4th";
            case 12:
                return "5th";
            case 13:
                return "6th";
            case 14:
                return "6th";
            case 15:
                return "7th";
            case 16:
                return "8th";
            case 17:
                return "9th";
            case 18:
                return "11th";
            case 19:
                return "12th";
            case 20:
                return "13th";
            case 21:
                return "14th";
            case 22:
                return "15th";
            case 23:
                return "16th";
            default:
                return "HH";
        }
    }
}