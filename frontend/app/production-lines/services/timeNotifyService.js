"use strict";
var __decorate = (this && this.__decorate) || function (decorators, target, key, desc) {
    var c = arguments.length, r = c < 3 ? target : desc === null ? desc = Object.getOwnPropertyDescriptor(target, key) : desc, d;
    if (typeof Reflect === "object" && typeof Reflect.decorate === "function") r = Reflect.decorate(decorators, target, key, desc);
    else for (var i = decorators.length - 1; i >= 0; i--) if (d = decorators[i]) r = (c < 3 ? d(r) : c > 3 ? d(target, key, r) : d(target, key)) || r;
    return c > 3 && r && Object.defineProperty(target, key, r), r;
};
var __metadata = (this && this.__metadata) || function (k, v) {
    if (typeof Reflect === "object" && typeof Reflect.metadata === "function") return Reflect.metadata(k, v);
};
var Rx_1 = require('rxjs/Rx');
var core_1 = require("@angular/core");
var TimeNotifyService = (function () {
    function TimeNotifyService() {
        var _this = this;
        this.hourChanged = new Rx_1.Subject();
        this.minuteChanged = new Rx_1.Subject();
        this.secondChanged = new Rx_1.Subject();
        setTimeout(function () { return _this.timer(); }, 1000); // just a delay to get first hour-change..
    }
    TimeNotifyService.prototype.timer = function () {
        var _this = this;
        var d = new Date();
        var curHour = d.getHours();
        var curMin = d.getMinutes();
        var curSec = d.getSeconds();
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
        setTimeout(function () { return _this.timer(); }, 250);
    };
    TimeNotifyService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], TimeNotifyService);
    return TimeNotifyService;
}());
exports.TimeNotifyService = TimeNotifyService;
//# sourceMappingURL=timeNotifyService.js.map