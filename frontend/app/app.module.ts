import { NgModule }      from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule }   from '@angular/forms';
import { HttpModule } from '@angular/http'
import { RouterModule, Routes} from '@angular/router'

import { AppComponent }   from './app.component';
import { ProductionLineService }   from './production-lines/services/production-line.service';
import { TimeNotifyService }   from './production-lines/services/timeNotifyService';
import { ProductionLinesComponent } from './production-lines/lines.component'
import { ProductionLineDetailComponent } from './production-lines/line-detail.component'
import { FinishingLineDetailShowcaseComponent } from './production-lines/showcases/finishing-line-detail-showcase.component'
import { CuttingLineDetailShowcaseComponent } from './production-lines/showcases/cutting-line-detail-showcase.component'
import { ProductionLineDetailShowcaseComponent } from './production-lines/showcases/production-line-detail-showcase.component'
import { WelcomeComponent } from './home/welcome.component'
import { DatePickerModule } from "ng2-datepicker";
import { Ng2Bs3ModalModule } from 'ng2-bs3-modal/ng2-bs3-modal';
import { HourToEngConverter } from "./production-lines/converter/hourToEngConverter";
import {ChartsModule} from "ng2-charts";

const appRoutes: Routes = [
    { path: '', redirectTo: 'welcome', pathMatch: 'full' },
    { path: 'welcome', component: WelcomeComponent },
    { path: 'productionLines', component: ProductionLinesComponent },
    { path: 'productionLines/:lineId', component: ProductionLineDetailComponent },
    { path: 'productionLines/:lineId/showcaseFinishing', component: FinishingLineDetailShowcaseComponent },
    { path: 'productionLines/:lineId/showcaseProduction', component: ProductionLineDetailShowcaseComponent },
    { path: 'productionLines/:lineId/showcaseCutting', component: CuttingLineDetailShowcaseComponent },
    //{ path: '**', component: PageNotFoundComponent }
];

@NgModule({
    imports: [
        BrowserModule,
        FormsModule,
        HttpModule,
        DatePickerModule,
        Ng2Bs3ModalModule,
        ChartsModule,
        RouterModule.forRoot(appRoutes)
    ],
    declarations: [
        AppComponent,
        ProductionLinesComponent,
        ProductionLineDetailComponent,
        FinishingLineDetailShowcaseComponent,
        ProductionLineDetailShowcaseComponent,
        CuttingLineDetailShowcaseComponent,
        WelcomeComponent
    ],
    providers: [
        ProductionLineService,
        TimeNotifyService,
        HourToEngConverter
    ],
    bootstrap:    [ AppComponent ]
})
export class AppModule { }