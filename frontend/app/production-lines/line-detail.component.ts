import { Component, OnInit } from '@angular/core';
import { Router, ActivatedRoute } from '@angular/router';
import * as moment from 'moment';

import { ILine } from './models/production-line'
import { ProductionLineService } from './services/production-line.service'
import { IDateInfo } from "./models/dateInfo";
import {IHourlyInfo} from "./models/hourlyInfo";

@Component({
    templateUrl: 'app/production-lines/line-detail.component.html'
})

export class ProductionLineDetailComponent implements OnInit{
    pageTitle: string = 'Product Detail';
    lineId: string;
    line: ILine;
    dateInfo : IDateInfo= {
        _id : '',
        lineId: '',
        planDHULevel : null,
        planEfficiency: null,
        productionHour: null,
        goal: null,
        workers: null,
        minutesPerProduct: null,
        date: new Date
    };
    errorMessage: string;
    momentDate: moment.Moment;
    date : Date;
    createMode: boolean;
    hourlyInfos: IHourlyInfo[] = new Array();
    availableHours : string[] = ['8-9', '9-10', '10-11', '11-12', '12-13', '13-14', '14-15', '15-16', '16-17',
        '17-18', '18-19', '19-20', '20-21', '21-22', '22-23', '23-24'];
    completed : number;
    dhu : number;
    selectedHour : string;
    lineType : string = '';

    constructor(private _router: Router,
                private _route: ActivatedRoute,
                private _productionLineService: ProductionLineService){
    }

    ngOnInit() {
        if (!this.line) {
            this._route.params.subscribe(params => {
                this.lineId = params['lineId'];
            });
            //this.pageTitle += `: ${this.lineId}`;
            this.getLine(this.lineId);
            this.momentDate = moment(new Date());
        }
    }

    valueChanged(value: moment.Moment) {
        this.momentDate = value;
        console.log('Value has changed : ', this.momentDate.format('YYYY-MM-DD'));
        this.getDateInfo(this.momentDate.format('YYYY-MM-DD'));
    }

    getLine(id: string) {
        this._productionLineService.getProductionLine(id)
            .subscribe(
                line => {
                    this.line = line;
                    this.lineType = this.line.lineType;
                    this.dateInfo.lineId = line._id;
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
                        this.createMode = false;
                        this.getHourlyInfos(this.dateInfo)
                    }else {
                        this.dateInfo.productionHour = null;
                        this.dateInfo.planEfficiency = null;
                        this.dateInfo.planDHULevel = null;
                        this.createMode = true;
                    }
                }
            )
    }

    private getHourlyInfos(dateInfo : IDateInfo) {
        this._productionLineService.getHourlyInfo(dateInfo)
            .subscribe(
                hourlyInfos => {
                    this.hourlyInfos = hourlyInfos;
                    this.updateAvailableHours();
                    console.log('Hour: ' + this.hourlyInfos)
                }
            )
    }

    private updateAvailableHours() {
        for(var i = this.hourlyInfos.length - 1; i >= 0; i--) {
            var hourFromHourlyInfo = this.hourlyInfos[i].startHour + "-" + this.hourlyInfos[i].endHour;
            for(var j = 0; j < this.availableHours.length - 1; j++) {
                if(this.availableHours[j] === hourFromHourlyInfo) {
                    this.availableHours.splice(j , 1);
                    break;
                }
            }
        }
        this.selectedHour = this.availableHours[0];
    }

    updateProductionLine(): void {
        this._productionLineService.updateProductionLine(this.line)
            .subscribe(
                line => {
                    this.line = line;
                    console.log('Updated Item: ' + this.line.lineName);
                },
                error =>  this.errorMessage = <any>error);
    }

    updateDateInfo() : void {
        this._productionLineService.updateDateInfo(this.dateInfo)
            .subscribe(
                dateInfo => {
                    if(dateInfo) {
                        console.log('Date Info Updated');
                    }
            }
        );
    }

    createDateInfo() : void {
        if(this.line.lineType =='Production'){
            this.dateInfo.goal = (this.dateInfo.productionHour * 60 * this.dateInfo.workers * this.dateInfo.planEfficiency) /
                (100 * this.dateInfo.minutesPerProduct);
        }else{
            this.dateInfo.planEfficiency = (this.dateInfo.minutesPerProduct * this.dateInfo.goal) /
                (this.dateInfo.productionHour * 60 * this.dateInfo.workers) * 100;
        }

        if(!this.createMode){
            this.updateDateInfo()
        } else{
            this._productionLineService.createDateInfo(this.dateInfo)
                .subscribe(
                    dateInfo => {
                        if(dateInfo) {
                            this.dateInfo = dateInfo;
                            this.createMode = false;
                        }
                    }
                );
        }
    }
    selectedHourChanged(value){
        this.selectedHour = value;
    }

    createHourlyInfo() : void {
        if(this.completed == null || (this.line.lineType=="Production" && this.dhu == null)) return;

        var hourSegment = this.selectedHour.split('-');

        var hourlyInfo = {
            lineId : this.lineId,
            dateId : this.dateInfo._id,
            startHour : hourSegment[0],
            endHour : hourSegment[1],
            goal : this.dateInfo.goal / this.dateInfo.productionHour,
            completed : this.completed,
            dhu : this.dhu
        };
        this._productionLineService.createHourlyInfo(hourlyInfo)
            .subscribe(
                hourlyInfo => {
                    if(hourlyInfo) {
                        console.log('Created HourlyInfo: ' + hourlyInfo);
                        this.hourlyInfos.push(hourlyInfo);
                        this.completed = null;
                        this.dhu = null;
                        this.updateAvailableHours();
                    }
                }
            )
    }

    updateHourlyInfo(hourlyInfo : IHourlyInfo) : void {
        this._productionLineService.updateHourlyInfo(hourlyInfo)
            .subscribe(
                hourlyInfo => {
                    if(hourlyInfo) {
                        console.log('Hourly Info Updated');
                    }
                }
            )
    }

    deleteHourlyInfo(hourlyInfo : IHourlyInfo) : void {
        this._productionLineService.deleteHourlyInfo(hourlyInfo)
            .subscribe(
                statusCode => {
                    if(statusCode == 204) {
                        let index = this.hourlyInfos.indexOf(hourlyInfo);
                        this.hourlyInfos.splice(index, 1);
                        console.log('Removed from UI. Item: ' + hourlyInfo._id);
                    }
                }
            )
    }

    showcaseProductionLine(): void {
        if(this.line.lineType === 'Finishing'){
            this._router.navigate(['productionLines', this.lineId, 'showcaseFinishing']);
        }else if(this.line.lineType === 'Production'){
            this._router.navigate(['productionLines', this.lineId, 'showcaseProduction']);
        }else if(this.line.lineType === 'Cutting'){
            this._router.navigate(['productionLines', this.lineId, 'showcaseCutting']);
        }
    }

    onBack(): void{
        this._router.navigate(['productionLines']);
    }
}