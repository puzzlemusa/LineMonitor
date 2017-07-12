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
var platform_browser_1 = require('@angular/platform-browser');
var forms_1 = require('@angular/forms');
var http_1 = require('@angular/http');
var router_1 = require('@angular/router');
var app_component_1 = require('./app.component');
var production_line_service_1 = require('./production-lines/services/production-line.service');
var timeNotifyService_1 = require('./production-lines/services/timeNotifyService');
var lines_component_1 = require('./production-lines/lines.component');
var line_detail_component_1 = require('./production-lines/line-detail.component');
var finishing_line_detail_showcase_component_1 = require('./production-lines/showcases/finishing-line-detail-showcase.component');
var cutting_line_detail_showcase_component_1 = require('./production-lines/showcases/cutting-line-detail-showcase.component');
var production_line_detail_showcase_component_1 = require('./production-lines/showcases/production-line-detail-showcase.component');
var welcome_component_1 = require('./home/welcome.component');
var ng2_datepicker_1 = require("ng2-datepicker");
var ng2_bs3_modal_1 = require('ng2-bs3-modal/ng2-bs3-modal');
var hourToEngConverter_1 = require("./production-lines/converter/hourToEngConverter");
var appRoutes = [
    { path: '', redirectTo: 'welcome', pathMatch: 'full' },
    { path: 'welcome', component: welcome_component_1.WelcomeComponent },
    { path: 'productionLines', component: lines_component_1.ProductionLinesComponent },
    { path: 'productionLines/:lineId', component: line_detail_component_1.ProductionLineDetailComponent },
    { path: 'productionLines/:lineId/showcaseFinishing', component: finishing_line_detail_showcase_component_1.FinishingLineDetailShowcaseComponent },
    { path: 'productionLines/:lineId/showcaseProduction', component: production_line_detail_showcase_component_1.ProductionLineDetailShowcaseComponent },
    { path: 'productionLines/:lineId/showcaseCutting', component: cutting_line_detail_showcase_component_1.CuttingLineDetailShowcaseComponent },
];
var AppModule = (function () {
    function AppModule() {
    }
    AppModule = __decorate([
        core_1.NgModule({
            imports: [
                platform_browser_1.BrowserModule,
                forms_1.FormsModule,
                http_1.HttpModule,
                ng2_datepicker_1.DatePickerModule,
                ng2_bs3_modal_1.Ng2Bs3ModalModule,
                router_1.RouterModule.forRoot(appRoutes)
            ],
            declarations: [
                app_component_1.AppComponent,
                lines_component_1.ProductionLinesComponent,
                line_detail_component_1.ProductionLineDetailComponent,
                finishing_line_detail_showcase_component_1.FinishingLineDetailShowcaseComponent,
                production_line_detail_showcase_component_1.ProductionLineDetailShowcaseComponent,
                cutting_line_detail_showcase_component_1.CuttingLineDetailShowcaseComponent,
                welcome_component_1.WelcomeComponent
            ],
            providers: [
                production_line_service_1.ProductionLineService,
                timeNotifyService_1.TimeNotifyService,
                hourToEngConverter_1.HourToEngConverter
            ],
            bootstrap: [app_component_1.AppComponent]
        }), 
        __metadata('design:paramtypes', [])
    ], AppModule);
    return AppModule;
}());
exports.AppModule = AppModule;
//# sourceMappingURL=app.module.js.map