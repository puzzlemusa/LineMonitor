import { Component, OnInit, NgZone, AfterViewInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as io from 'socket.io-client'
import * as moment from 'moment';

import { ILine } from '../models/production-line'
import { ProductionLineService } from '../services/production-line.service'
import {IDateInfo} from "../models/dateInfo";
import {IHourlyInfo} from "../models/hourlyInfo";
import {TimeNotifyService} from "../services/timeNotifyService";
import {HourToEngConverter} from "../converter/hourToEngConverter";
declare var $:JQueryStatic;

@Component({
    moduleId: module.id,
    templateUrl: 'production-line-detail-showcase.component.html'
})

export class ProductionLineDetailShowcaseComponent implements OnInit, AfterViewInit {
    line: ILine;
    lineId: string;
    planedEfficiency: string;
    hourlyEfficiency: string;
    avgEfficiency: string;
    avgDhu: string;
    errorMessage: string;
    socket:any = null;
    hourlyInfos : IHourlyInfo[];
    hourlyInfo : IHourlyInfo = {
        _id : "",
        lineId : "",
        dateId : "",
        startHour : null,
        endHour : null,
        completed : null,
        goal : null,
        dhu : null
    };
    dateInfo : IDateInfo;
    momentDate: moment.Moment;
    hour : number;
    totalGoal : number;
    totalCompleted  : number;
    hourEng : string;

    public barChartOptions:any = {
        scaleShowVerticalLines: false,
        responsive: true
    };
    public barChartLabels:string[] = [];
    public barChartType:string = 'bar';
    public barChartLegend:boolean = true;

    public barChartData:any[] = [
        {data: [], label: 'Production Achieved'}
    ];

    constructor(private _zone: NgZone,
                private _route: ActivatedRoute,
                private _productionLineService: ProductionLineService,
                private _timeNotifyService: TimeNotifyService,
                private _hourConverter : HourToEngConverter){

        this.socket = io.connect('http://localhost:3000');

        this.socket.on('hourUpdated', (data) => {
            this._zone.run(() => {
                this.getLine(this.lineId);
            });
        });
    }

    ngOnInit() {
        this._timeNotifyService.hourChanged.subscribe(hour => {
            this._zone.run(() => {
                this.getLine(this.lineId);
            });
            this.hour = hour - 1;
            this.setHourAndTotal();
        });

        if (!this.line) {
            this._route.params.subscribe(params => {
                this.lineId = params['lineId'];
            });
            this.momentDate = moment(new Date());
            this.getLine(this.lineId);
        }
    }

    ngAfterViewInit() {
        // $("#slideshow > div:gt(0)").hide();
        //
        // setInterval(function() {
        //     $('#slideshow > div:first')
        //         .fadeOut(1000)
        //         .next()
        //         .fadeIn(1000)
        //         .end()
        //         .appendTo('#slideshow');
        // }, 5000);
    }

    getLine(id: string) {
        this._productionLineService.getProductionLine(id)
            .subscribe(
                productionLine => {
                    this.line = productionLine;
                    this.getDateInfo(this.momentDate.format('YYYY-MM-DD'));
                },
                error => this.errorMessage = <any>error);
    }

    private getDateInfo(date: string) {
        this._productionLineService.getDateInfo(this.lineId, date)
            .subscribe(
                dateInfo => {
                    if(dateInfo) {
                        this.dateInfo = dateInfo;
                        this.setPlanEfficiency();
                        this.getHourlyInfos(this.dateInfo);
                    }
                }
            )
    }

    private getHourlyInfos(dateInfo : IDateInfo) {
        this._productionLineService.getHourlyInfo(dateInfo)
            .subscribe(
                hourlyInfos => {
                    this.hourlyInfos = hourlyInfos;
                    if(this.hour) {
                        this.setHourAndTotal();
                    }
                    console.log('Hour: ' + this.hourlyInfos)
                }
            )
    }

    private setHourAndTotal() {
        if( this.hourlyInfos) {
            this.totalGoal = 0;
            this.totalCompleted = 0;
            let totalEfficiency = 0;
            let totalDhu = 0;

            this.barChartLabels = [];
            this.barChartData[0].data = [];

            for (var i = 0; i < this.hourlyInfos.length; i++) {
                this.totalCompleted += this.hourlyInfos[i].completed;
                this.totalGoal += this.hourlyInfos[i].goal;
                //efficiencyChartLabel.push(this.hourlyInfos[i].startHour + ' ' + this.hourlyInfos[i].endHour);
                //efficiencyChartData.push(this.hourlyInfos[i].completed);
                this.barChartLabels.push(this.hourlyInfos[i].startHour + ' - ' + this.hourlyInfos[i].endHour);
                this.barChartData[0].data.push(this.hourlyInfos[i].completed.toString());

                var efficiency = (this.hourlyInfos[i].completed * +this.planedEfficiency) / (this.hourlyInfos[i].goal);
                if(this.hourlyInfos[i].startHour === this.hour) {
                    this.hourlyInfo = this.hourlyInfos[i];
                    this.hourEng = this._hourConverter.getEngFromHour(this.hour);
                    this.hourlyEfficiency = efficiency.toFixed(2);
                }

                totalEfficiency += efficiency;
                totalDhu += this.hourlyInfos[i].dhu;
            }
            this.avgEfficiency = (totalEfficiency / i).toFixed(2);
            this.avgDhu = (totalDhu / i).toFixed(2);
        }
    }

    private setPlanEfficiency() {
        this.planedEfficiency = ((this.dateInfo.minutesPerProduct * this.dateInfo.goal * 100) /
            (this.dateInfo.productionHour * 60 * this.dateInfo.workers)).toFixed(2);
    }
}