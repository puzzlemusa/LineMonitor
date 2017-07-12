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
var http_1 = require('@angular/http');
var Observable_1 = require('rxjs/Observable');
var ProductionLineService = (function () {
    //private _productionLinesUrl = '../api/products/products.json';
    function ProductionLineService(_http) {
        this._http = _http;
        this._productionLinesUrl = 'http://localhost:3000/api/lines/';
    }
    ProductionLineService.prototype.getProductionLines = function () {
        return this._http.get(this._productionLinesUrl)
            .map(function (response) { return response.json(); })
            .do(function (data) { return console.log('All: ' + JSON.stringify(data)); })
            .catch(this.handleError);
    };
    ProductionLineService.prototype.getProductionLine = function (id) {
        return this._http.get(this._productionLinesUrl + id)
            .map(function (response) { return response.json(); })
            .do(function (data) { return console.log('Line: ' + JSON.stringify(data)); })
            .catch(this.handleError);
    };
    ProductionLineService.prototype.getHourlyInfo = function (dateInfo) {
        return this._http.get(this._productionLinesUrl + dateInfo.lineId + '/dates/' + dateInfo._id + '/hours')
            .map(function (response) { return response.json(); })
            .do(function (data) { return console.log('Hour: ' + JSON.stringify(data)); })
            .catch(this.handleError);
    };
    ProductionLineService.prototype.getDateInfo = function (id, date) {
        var params = new http_1.URLSearchParams();
        params.set('date', date);
        params.set('lineId', id);
        return this._http.get(this._productionLinesUrl + id + '/dates', { search: params })
            .map(function (response) {
            var res = response.json();
            if (res.length > 0) {
                var res1 = res[0];
                var dateInfo = {
                    _id: res1._id,
                    lineId: res1.lineId,
                    date: new Date(res1.date),
                    productionHour: res1.productionHour,
                    goal: res1.goal,
                    planEfficiency: res1.planEfficiency,
                    planDHULevel: res1.planDHULevel,
                    workers: res1.workers,
                    minutesPerProduct: res1.minutesPerProduct
                };
                return dateInfo;
            }
            return null;
        })
            .do(function (data) { return console.log('Date: ' + JSON.stringify(data)); })
            .catch(this.handleError);
    };
    ProductionLineService.prototype.deleteProductionLine = function (id) {
        return this._http.delete(this._productionLinesUrl + id)
            .map(function (response) { return response.status; })
            .do(function (data) { return console.log('Deleted Production line. Id: ' + id); })
            .catch(this.handleError);
    };
    ProductionLineService.prototype.updateProductionLine = function (productionLine) {
        var bodyString = JSON.stringify(productionLine);
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this._http.put(this._productionLinesUrl + productionLine._id, bodyString, options)
            .map(function (response) {
            if (response.status === 200) {
                return response.json();
            }
        })
            .do(function (data) { return console.log('Deleted Production line. Id: ' + productionLine._id); })
            .catch(this.handleError);
    };
    ProductionLineService.prototype.handleError = function (error) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable_1.Observable.throw(error.json().error || 'Server error: ' + error);
    };
    ProductionLineService.prototype.createDateInfo = function (dateInfo) {
        delete dateInfo['_id'];
        var bodyString = JSON.stringify(dateInfo);
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this._http.post(this._productionLinesUrl + dateInfo.lineId + '/dates', bodyString, options)
            .map(function (response) {
            if (response.status === 201) {
                return response.json();
            }
        })
            .catch(this.handleError);
    };
    ProductionLineService.prototype.updateDateInfo = function (dateInfo) {
        var bodyString = JSON.stringify(dateInfo);
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this._http.put(this._productionLinesUrl + dateInfo.lineId + '/dates/' + dateInfo._id, bodyString, options)
            .map(function (response) {
            if (response.status === 200) {
                return response.json();
            }
        })
            .catch(this.handleError);
    };
    ProductionLineService.prototype.updateHourlyInfo = function (hourlyInfo) {
        var bodyString = JSON.stringify(hourlyInfo);
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this._http.put(this._productionLinesUrl + hourlyInfo.lineId + '/dates/'
            + hourlyInfo.dateId + '/hours/' + hourlyInfo._id, bodyString, options)
            .map(function (response) {
            if (response.status === 200) {
                return response.json();
            }
        })
            .catch(this.handleError);
    };
    ProductionLineService.prototype.createHourlyInfo = function (hourlyInfo) {
        var bodyString = JSON.stringify(hourlyInfo);
        var headers = new http_1.Headers({ 'Content-Type': 'application/json' });
        var options = new http_1.RequestOptions({ headers: headers });
        return this._http.post(this._productionLinesUrl + hourlyInfo.lineId + '/dates/'
            + hourlyInfo.dateId + '/hours', bodyString, options)
            .map(function (response) {
            if (response.status === 201) {
                return response.json();
            }
        })
            .catch(this.handleError);
    };
    ProductionLineService.prototype.deleteHourlyInfo = function (hourlyInfo) {
        return this._http.delete(this._productionLinesUrl + hourlyInfo.lineId + '/dates/'
            + hourlyInfo.dateId + '/hours/' + hourlyInfo._id)
            .map(function (response) { return response.status; })
            .do(function (data) { return console.log('Hourly info deleted. Id: ' + hourlyInfo._id); })
            .catch(this.handleError);
    };
    ProductionLineService = __decorate([
        core_1.Injectable(), 
        __metadata('design:paramtypes', [http_1.Http])
    ], ProductionLineService);
    return ProductionLineService;
}());
exports.ProductionLineService = ProductionLineService;
//# sourceMappingURL=production-line.service.js.map