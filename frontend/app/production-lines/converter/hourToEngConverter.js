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
var core_1 = require("@angular/core");
var HourToEngConverter = (function () {
    function HourToEngConverter() {
    }
    HourToEngConverter.prototype.getEngFromHour = function (hour) {
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
    };
    HourToEngConverter = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [])
    ], HourToEngConverter);
    return HourToEngConverter;
}());
exports.HourToEngConverter = HourToEngConverter;
//# sourceMappingURL=hourToEngConverter.js.map