import { Component, OnInit } from '@angular/core'

import { ILine } from './models/production-line'
import { ProductionLineService } from './services/production-line.service'

@Component({
    templateUrl: 'app/production-lines/lines.component.html',
    styleUrls: ['app/production-lines/lines.component.css'],
    //pipes: [ProductionLineFilter],
    //directives: [ROUTER_DIRECTIVES]
})

export class ProductionLinesComponent implements OnInit{
    pageTitle: string = 'Lines';
    listFilter: string = '';
    errorMessage: string;
    lines: ILine[];

    constructor(private _productLineService: ProductionLineService){

    }

    editProductionLine(): void {
    }

    deleteProductionLine(productionLine: ILine): void {
        this._productLineService.deleteProductionLine(productionLine._id)
                    .subscribe(
                        statusCode => {
                            if(statusCode == 204){
                                let index = this.lines.indexOf(productionLine);
                                this.lines.splice(index, 1);
                                console.log('Removed from UI. Item: ' + productionLine.lineName);
                            }
                        },
                        error =>  this.errorMessage = <any>error);
    }

    ngOnInit(): void {
        this._productLineService.getProductionLines()
                     .subscribe(
                         lines => this.lines = lines,
                       error =>  this.errorMessage = <any>error);
    }
}