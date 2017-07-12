import { Component, OnInit, NgZone } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import * as io from 'socket.io-client'
import * as moment from 'moment';

import { ILine } from '../models/production-line'
import { ProductionLineService } from '../services/production-line.service'
import {IDateInfo} from "../models/dateInfo";
import {IHourlyInfo} from "../models/hourlyInfo";
import {TimeNotifyService} from "../services/timeNotifyService";
import {HourToEngConverter} from "../converter/hourToEngConverter";

@Component({
    moduleId: module.id,
    templateUrl: 'cutting-line-detail-showcase.component.html'
})

export class CuttingLineDetailShowcaseComponent implements OnInit {
    line: ILine;
    lineId: string;
    performance: string;
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
    hourEng : string;
    totalCompleted : number;
    totalGoal : number;

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
            if(this.dateInfo != null){
                this._zone.run(() => {
                    this.getLine(this.lineId);
                });
            }
            this.hour = hour - 1;
            this.setHour();
        });

        if (!this.line) {
            this._route.params.subscribe(params => {
                this.lineId = params['lineId'];
            });
            this.momentDate = moment(new Date());
            this.getLine(this.lineId);
        }
    }

    getLine(id: string) {
        this._productionLineService.getProductionLine(id)
            .subscribe(
                productionLine => {
                    this.line = productionLine;
                    this.getDateInfo(this.momentDate.format('YYYY-MM-DD'));
                    this.setEfficiency();
                },
                error => this.errorMessage = <any>error);
    }

    private getDateInfo(date: string) {
        this._productionLineService.getDateInfo(this.lineId, date)
            .subscribe(
                dateInfo => {
                    if(dateInfo) {
                        this.dateInfo = dateInfo;
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
                        this.setHour();
                    }
                    console.log('Hour: ' + this.hourlyInfos)
                }
            )
    }

    private setHour() {
        if( this.hourlyInfos) {
            this.totalCompleted = 0;
            this.totalGoal = 0;
            for (var i = 0; i < this.hourlyInfos.length; i++) {
                if(this.hourlyInfos[i].startHour === this.hour) {
                    this.hourlyInfo = this.hourlyInfos[i];
                    this.hourEng = this._hourConverter.getEngFromHour(this.hour);
                    this.setEfficiency();
                }
                this.totalCompleted += this.hourlyInfos[i].completed;
                this.totalGoal += this.hourlyInfos[i].goal;
            }
            this.performance = (this.totalCompleted / this.totalGoal * 100).toFixed(2);
        }
    }

    updateUI(productionLine: ILine, efficiency: number) {
        this.line = productionLine;
        this.setEfficiency();
    }

    private setEfficiency() {
        this.performance = (this.hourlyInfo.goal / this.hourlyInfo.completed * 100).toFixed(2);
    }
}