import { Injectable } from '@angular/core'
import {Http, Response, Headers, RequestOptions, URLSearchParams} from '@angular/http';
import { Observable } from 'rxjs/Observable';

import { ILine } from '../models/production-line';
import { IDateInfo } from "../models/dateInfo";
import { IHourlyInfo } from "../models/hourlyInfo";
import {ObjectUnsubscribedError} from "rxjs";

@Injectable()
export class ProductionLineService{
    private _productionLinesUrl = 'http://localhost:3000/api/lines/';
    //private _productionLinesUrl = '../api/products/products.json';

    constructor(private _http: Http) { }

    getProductionLines(): Observable<ILine[]> {
        return this._http.get(this._productionLinesUrl)
            .map((response: Response) => response.json())
            .do(data => console.log('All: ' +  JSON.stringify(data)))
            .catch(this.handleError);
    }

    getProductionLine(id: string) : Observable<ILine> {
        return this._http.get(this._productionLinesUrl + id)
            .map((response: Response) => response.json())
            .do(data => console.log('Line: ' +  JSON.stringify(data)))
            .catch(this.handleError);
    }

    getHourlyInfo(dateInfo : IDateInfo) : Observable<IHourlyInfo[]> {
        return this._http.get(this._productionLinesUrl + dateInfo.lineId + '/dates/' + dateInfo._id + '/hours')
            .map((response: Response) => response.json())
            .do(data => console.log('Hour: ' +  JSON.stringify(data)))
            .catch(this.handleError);
    }

    getDateInfo(id: string, date: string) : Observable<IDateInfo>{
        let params: URLSearchParams = new URLSearchParams();
        params.set('date', date);
        params.set('lineId', id);

        return this._http.get(this._productionLinesUrl + id + '/dates', {search: params})
            .map((response: Response) => {
                var res = response.json();
                if(res.length > 0) {
                    var res1 = res[0];
                    var dateInfo : IDateInfo = {
                        _id : res1._id,
                        lineId : res1.lineId,
                        date : new Date(res1.date),
                        productionHour : res1.productionHour,
                        goal : res1.goal,
                        planEfficiency : res1.planEfficiency,
                        planDHULevel : res1.planDHULevel,
                        workers : res1.workers,
                        minutesPerProduct : res1.minutesPerProduct
                    };
                    return dateInfo;
                }
                return null;
            })
            .do(data => console.log('Date: ' +  JSON.stringify(data)))
            .catch(this.handleError);
    }

    deleteProductionLine(id: string): Observable<number> {
        return this._http.delete(this._productionLinesUrl + id)
            .map((response: Response) => response.status)
            .do(data => console.log('Deleted Production line. Id: ' + id))
            .catch(this.handleError);
    }

    updateProductionLine(productionLine: ILine): Observable<ILine> {
        let bodyString = JSON.stringify(productionLine);
        let headers      = new Headers({ 'Content-Type': 'application/json' });
        let options       = new RequestOptions({ headers: headers });

        return this._http.put(this._productionLinesUrl + productionLine._id, bodyString, options)
            .map((response: Response) => {
                if(response.status ===200){
                    return response.json();
                }
            })
            .do(data => console.log('Deleted Production line. Id: ' + productionLine._id))
            .catch(this.handleError);
    }

    private handleError(error: Response) {
        // in a real world app, we may send the server to some remote logging infrastructure
        // instead of just logging it to the console
        console.error(error);
        return Observable.throw(error.json().error || 'Server error: ' + error);
    }

    createDateInfo(dateInfo: IDateInfo) : Observable<IDateInfo> {
        delete dateInfo['_id'];
        let bodyString = JSON.stringify(dateInfo);
        let headers      = new Headers({ 'Content-Type': 'application/json' });
        let options       = new RequestOptions({ headers: headers });

        return this._http.post(this._productionLinesUrl + dateInfo.lineId + '/dates', bodyString, options)
            .map((response: Response) => {
                if(response.status === 201) {
                    return response.json();
                }
            })
            .catch(this.handleError);
    }

    updateDateInfo(dateInfo: IDateInfo) : Observable<IDateInfo> {
        let bodyString = JSON.stringify(dateInfo);
        let headers      = new Headers({ 'Content-Type': 'application/json' });
        let options       = new RequestOptions({ headers: headers });

        return this._http.put(this._productionLinesUrl + dateInfo.lineId + '/dates/' + dateInfo._id, bodyString, options)
            .map((response: Response) => {
                if(response.status === 200) {
                    return response.json();
                }
            })
            .catch(this.handleError);
    }

    updateHourlyInfo(hourlyInfo: IHourlyInfo) : Observable<IHourlyInfo> {
        let bodyString = JSON.stringify(hourlyInfo);
        let headers      = new Headers({ 'Content-Type': 'application/json' });
        let options       = new RequestOptions({ headers: headers });

        return this._http.put(this._productionLinesUrl + hourlyInfo.lineId + '/dates/'
            + hourlyInfo.dateId + '/hours/' + hourlyInfo._id, bodyString, options)
            .map((response: Response) => {
                if(response.status === 200) {
                    return response.json();
                }
            })
            .catch(this.handleError);
    }

    createHourlyInfo(hourlyInfo: any) : Observable<IHourlyInfo> {
        let bodyString = JSON.stringify(hourlyInfo);
        let headers      = new Headers({ 'Content-Type': 'application/json' });
        let options       = new RequestOptions({ headers: headers });

        return this._http.post(this._productionLinesUrl + hourlyInfo.lineId + '/dates/'
            + hourlyInfo.dateId + '/hours', bodyString, options)
            .map((response: Response) => {
                if(response.status === 201) {
                    return response.json();
                }
            })
            .catch(this.handleError);
    }

    deleteHourlyInfo(hourlyInfo: IHourlyInfo) {
        return this._http.delete(this._productionLinesUrl + hourlyInfo.lineId + '/dates/'
            + hourlyInfo.dateId + '/hours/' + hourlyInfo._id)
            .map((response: Response) => response.status)
            .do(data => console.log('Hourly info deleted. Id: ' + hourlyInfo._id))
            .catch(this.handleError);
    }
}