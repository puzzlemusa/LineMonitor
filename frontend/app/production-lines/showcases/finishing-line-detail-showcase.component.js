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
var core_1 = require('@angular/core');
var router_1 = require('@angular/router');
var io = require('socket.io-client');
var moment = require('moment');
var production_line_service_1 = require('../services/production-line.service');
var timeNotifyService_1 = require("../services/timeNotifyService");
var hourToEngConverter_1 = require("../converter/hourToEngConverter");
var FinishingLineDetailShowcaseComponent = (function () {
    function FinishingLineDetailShowcaseComponent(_zone, _route, _productionLineService, _timeNotifyService, _hourConverter) {
        var _this = this;
        this._zone = _zone;
        this._route = _route;
        this._productionLineService = _productionLineService;
        this._timeNotifyService = _timeNotifyService;
        this._hourConverter = _hourConverter;
        this.socket = null;
        this.hourlyInfo = {
            _id: "",
            lineId: "",
            dateId: "",
            startHour: null,
            endHour: null,
            completed: null,
            goal: null,
            dhu: null
        };
        this.socket = io.connect('http://localhost:3000');
        this.socket.on('hourUpdated', function (data) {
            _this._zone.run(function () {
                _this.getLine(_this.lineId);
            });
        });
    }
    FinishingLineDetailShowcaseComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._timeNotifyService.hourChanged.subscribe(function (hour) {
            if (_this.dateInfo != null) {
                _this._zone.run(function () {
                    _this.getLine(_this.lineId);
                });
            }
            _this.hour = hour - 1;
            _this.setHour();
        });
        if (!this.line) {
            this._route.params.subscribe(function (params) {
                _this.lineId = params['lineId'];
            });
            this.momentDate = moment(new Date());
            this.getLine(this.lineId);
        }
    };
    FinishingLineDetailShowcaseComponent.prototype.getLine = function (id) {
        var _this = this;
        this._productionLineService.getProductionLine(id)
            .subscribe(function (productionLine) {
            _this.line = productionLine;
            _this.getDateInfo(_this.momentDate.format('YYYY-MM-DD'));
        }, function (error) { return _this.errorMessage = error; });
    };
    FinishingLineDetailShowcaseComponent.prototype.getDateInfo = function (date) {
        var _this = this;
        this._productionLineService.getDateInfo(this.lineId, date)
            .subscribe(function (dateInfo) {
            if (dateInfo) {
                _this.dateInfo = dateInfo;
                _this.getHourlyInfos(_this.dateInfo);
            }
        });
    };
    FinishingLineDetailShowcaseComponent.prototype.getHourlyInfos = function (dateInfo) {
        var _this = this;
        this._productionLineService.getHourlyInfo(dateInfo)
            .subscribe(function (hourlyInfos) {
            _this.hourlyInfos = hourlyInfos;
            if (_this.hour) {
                _this.setHour();
            }
            console.log('Hour: ' + _this.hourlyInfos);
        });
    };
    FinishingLineDetailShowcaseComponent.prototype.setHour = function () {
        if (this.hourlyInfos) {
            this.totalCompleted = 0;
            this.totalGoal = 0;
            for (var i = 0; i < this.hourlyInfos.length; i++) {
                if (this.hourlyInfos[i].startHour === this.hour) {
                    this.hourlyInfo = this.hourlyInfos[i];
                    this.hourEng = this._hourConverter.getEngFromHour(this.hour);
                }
                this.totalCompleted += this.hourlyInfos[i].completed;
                this.totalGoal += this.hourlyInfos[i].goal;
            }
            this.performance = (this.totalCompleted / this.totalGoal * 100).toFixed(2);
        }
    };
    FinishingLineDetailShowcaseComponent.prototype.updateUI = function (productionLine, efficiency) {
        this.line = productionLine;
    };
    FinishingLineDetailShowcaseComponent = __decorate([
        core_1.Component({
            moduleId: module.id,
            templateUrl: 'finishing-line-detail-showcase.component.html'
        }), 
        __metadata('design:paramtypes', [core_1.NgZone, router_1.ActivatedRoute, production_line_service_1.ProductionLineService, timeNotifyService_1.TimeNotifyService, hourToEngConverter_1.HourToEngConverter])
    ], FinishingLineDetailShowcaseComponent);
    return FinishingLineDetailShowcaseComponent;
}());
exports.FinishingLineDetailShowcaseComponent = FinishingLineDetailShowcaseComponent;
//# sourceMappingURL=finishing-line-detail-showcase.component.js.map