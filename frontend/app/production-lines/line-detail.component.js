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
var moment = require('moment');
var production_line_service_1 = require('./services/production-line.service');
var ProductionLineDetailComponent = (function () {
    function ProductionLineDetailComponent(_router, _route, _productionLineService) {
        this._router = _router;
        this._route = _route;
        this._productionLineService = _productionLineService;
        this.pageTitle = 'Product Detail';
        this.dateInfo = {
            _id: '',
            lineId: '',
            planDHULevel: null,
            planEfficiency: null,
            productionHour: null,
            goal: null,
            workers: null,
            minutesPerProduct: null,
            date: new Date
        };
        this.hourlyInfos = new Array();
        this.availableHours = ['8-9', '9-10', '10-11', '11-12', '12-13', '13-14', '14-15', '15-16', '16-17',
            '17-18', '18-19', '19-20', '20-21', '21-22', '22-23', '23-24'];
        this.lineType = '';
    }
    ProductionLineDetailComponent.prototype.ngOnInit = function () {
        var _this = this;
        if (!this.line) {
            this._route.params.subscribe(function (params) {
                _this.lineId = params['lineId'];
            });
            //this.pageTitle += `: ${this.lineId}`;
            this.getLine(this.lineId);
            this.momentDate = moment(new Date());
        }
    };
    ProductionLineDetailComponent.prototype.valueChanged = function (value) {
        this.momentDate = value;
        console.log('Value has changed : ', this.momentDate.format('YYYY-MM-DD'));
        this.getDateInfo(this.momentDate.format('YYYY-MM-DD'));
    };
    ProductionLineDetailComponent.prototype.getLine = function (id) {
        var _this = this;
        this._productionLineService.getProductionLine(id)
            .subscribe(function (line) {
            _this.line = line;
            _this.lineType = _this.line.lineType;
            _this.dateInfo.lineId = line._id;
            _this.getDateInfo(_this.momentDate.format('YYYY-MM-DD'));
        }, function (error) { return _this.errorMessage = error; });
    };
    ProductionLineDetailComponent.prototype.getDateInfo = function (date) {
        var _this = this;
        this._productionLineService.getDateInfo(this.lineId, date)
            .subscribe(function (dateInfo) {
            if (dateInfo) {
                _this.dateInfo = dateInfo;
                _this.createMode = false;
                _this.getHourlyInfos(_this.dateInfo);
            }
            else {
                _this.dateInfo.productionHour = null;
                _this.dateInfo.planEfficiency = null;
                _this.dateInfo.planDHULevel = null;
                _this.createMode = true;
            }
        });
    };
    ProductionLineDetailComponent.prototype.getHourlyInfos = function (dateInfo) {
        var _this = this;
        this._productionLineService.getHourlyInfo(dateInfo)
            .subscribe(function (hourlyInfos) {
            _this.hourlyInfos = hourlyInfos;
            _this.updateAvailableHours();
            console.log('Hour: ' + _this.hourlyInfos);
        });
    };
    ProductionLineDetailComponent.prototype.updateAvailableHours = function () {
        for (var i = this.hourlyInfos.length - 1; i >= 0; i--) {
            var hourFromHourlyInfo = this.hourlyInfos[i].startHour + "-" + this.hourlyInfos[i].endHour;
            for (var j = 0; j < this.availableHours.length - 1; j++) {
                if (this.availableHours[j] === hourFromHourlyInfo) {
                    this.availableHours.splice(j, 1);
                    break;
                }
            }
        }
        this.selectedHour = this.availableHours[0];
    };
    ProductionLineDetailComponent.prototype.updateProductionLine = function () {
        var _this = this;
        this._productionLineService.updateProductionLine(this.line)
            .subscribe(function (line) {
            _this.line = line;
            console.log('Updated Item: ' + _this.line.lineName);
        }, function (error) { return _this.errorMessage = error; });
    };
    ProductionLineDetailComponent.prototype.updateDateInfo = function () {
        this._productionLineService.updateDateInfo(this.dateInfo)
            .subscribe(function (dateInfo) {
            if (dateInfo) {
                console.log('Date Info Updated');
            }
        });
    };
    ProductionLineDetailComponent.prototype.createDateInfo = function () {
        var _this = this;
        if (this.line.lineType == 'Production') {
            this.dateInfo.goal = (this.dateInfo.productionHour * 60 * this.dateInfo.workers * this.dateInfo.planEfficiency) /
                (100 * this.dateInfo.minutesPerProduct);
        }
        else {
            this.dateInfo.planEfficiency = (this.dateInfo.minutesPerProduct * this.dateInfo.goal) /
                (this.dateInfo.productionHour * 60 * this.dateInfo.workers) * 100;
        }
        if (!this.createMode) {
            this.updateDateInfo();
        }
        else {
            this._productionLineService.createDateInfo(this.dateInfo)
                .subscribe(function (dateInfo) {
                if (dateInfo) {
                    _this.dateInfo = dateInfo;
                    _this.createMode = false;
                }
            });
        }
    };
    ProductionLineDetailComponent.prototype.selectedHourChanged = function (value) {
        this.selectedHour = value;
    };
    ProductionLineDetailComponent.prototype.createHourlyInfo = function () {
        var _this = this;
        if (this.completed == null || (this.line.lineType == "Production" && this.dhu == null))
            return;
        var hourSegment = this.selectedHour.split('-');
        var hourlyInfo = {
            lineId: this.lineId,
            dateId: this.dateInfo._id,
            startHour: hourSegment[0],
            endHour: hourSegment[1],
            goal: this.dateInfo.goal / this.dateInfo.productionHour,
            completed: this.completed,
            dhu: this.dhu
        };
        this._productionLineService.createHourlyInfo(hourlyInfo)
            .subscribe(function (hourlyInfo) {
            if (hourlyInfo) {
                console.log('Created HourlyInfo: ' + hourlyInfo);
                _this.hourlyInfos.push(hourlyInfo);
                _this.completed = null;
                _this.dhu = null;
                _this.updateAvailableHours();
            }
        });
    };
    ProductionLineDetailComponent.prototype.updateHourlyInfo = function (hourlyInfo) {
        this._productionLineService.updateHourlyInfo(hourlyInfo)
            .subscribe(function (hourlyInfo) {
            if (hourlyInfo) {
                console.log('Hourly Info Updated');
            }
        });
    };
    ProductionLineDetailComponent.prototype.deleteHourlyInfo = function (hourlyInfo) {
        var _this = this;
        this._productionLineService.deleteHourlyInfo(hourlyInfo)
            .subscribe(function (statusCode) {
            if (statusCode == 204) {
                var index = _this.hourlyInfos.indexOf(hourlyInfo);
                _this.hourlyInfos.splice(index, 1);
                console.log('Removed from UI. Item: ' + hourlyInfo._id);
            }
        });
    };
    ProductionLineDetailComponent.prototype.showcaseProductionLine = function () {
        if (this.line.lineType === 'Finishing') {
            this._router.navigate(['productionLines', this.lineId, 'showcaseFinishing']);
        }
        else if (this.line.lineType === 'Production') {
            this._router.navigate(['productionLines', this.lineId, 'showcaseProduction']);
        }
        else if (this.line.lineType === 'Cutting') {
            this._router.navigate(['productionLines', this.lineId, 'showcaseCutting']);
        }
    };
    ProductionLineDetailComponent.prototype.onBack = function () {
        this._router.navigate(['productionLines']);
    };
    ProductionLineDetailComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/production-lines/line-detail.component.html'
        }), 
        __metadata('design:paramtypes', [router_1.Router, router_1.ActivatedRoute, production_line_service_1.ProductionLineService])
    ], ProductionLineDetailComponent);
    return ProductionLineDetailComponent;
}());
exports.ProductionLineDetailComponent = ProductionLineDetailComponent;
//# sourceMappingURL=line-detail.component.js.map