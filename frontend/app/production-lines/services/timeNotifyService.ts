import { Subject } from 'rxjs/Rx';
import { Injectable } from "@angular/core";

@Injectable()
export class TimeNotifyService {

    private _lastHour;
    private _lastMinute;
    private _lastSecond;

    public hourChanged = new Subject<number>();
    public minuteChanged = new Subject<number>();
    public secondChanged = new Subject<number>();

    constructor() {
        setTimeout(() => this.timer(), 1000); // just a delay to get first hour-change..
    }

    private timer() {
        const d = new Date();
        let curHour = d.getHours();
        const curMin = d.getMinutes();
        const curSec = d.getSeconds();

        if (curSec != this._lastSecond) {
            this.secondChanged.next(curSec);
            this._lastSecond = curSec;
        }

        if (curMin != this._lastMinute) {
            this.minuteChanged.next(curMin);
            this._lastMinute = curMin;
        }

        if (curHour != this._lastHour) {
            this.hourChanged.next(curHour);
            this._lastHour = curHour;
        }

        setTimeout(() => this.timer(), 250);
    }
}