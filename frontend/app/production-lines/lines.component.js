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
var production_line_service_1 = require('./services/production-line.service');
var ProductionLinesComponent = (function () {
    function ProductionLinesComponent(_productLineService) {
        this._productLineService = _productLineService;
        this.pageTitle = 'Lines';
        this.listFilter = '';
    }
    ProductionLinesComponent.prototype.editProductionLine = function () {
    };
    ProductionLinesComponent.prototype.deleteProductionLine = function (productionLine) {
        var _this = this;
        this._productLineService.deleteProductionLine(productionLine._id)
            .subscribe(function (statusCode) {
            if (statusCode == 204) {
                var index = _this.lines.indexOf(productionLine);
                _this.lines.splice(index, 1);
                console.log('Removed from UI. Item: ' + productionLine.lineName);
            }
        }, function (error) { return _this.errorMessage = error; });
    };
    ProductionLinesComponent.prototype.ngOnInit = function () {
        var _this = this;
        this._productLineService.getProductionLines()
            .subscribe(function (lines) { return _this.lines = lines; }, function (error) { return _this.errorMessage = error; });
    };
    ProductionLinesComponent = __decorate([
        core_1.Component({
            templateUrl: 'app/production-lines/lines.component.html',
            styleUrls: ['app/production-lines/lines.component.css'],
        }), 
        __metadata('design:paramtypes', [production_line_service_1.ProductionLineService])
    ], ProductionLinesComponent);
    return ProductionLinesComponent;
}());
exports.ProductionLinesComponent = ProductionLinesComponent;
//# sourceMappingURL=lines.component.js.map