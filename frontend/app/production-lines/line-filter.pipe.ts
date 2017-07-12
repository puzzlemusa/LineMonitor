import { PipeTransform, Pipe } from '@angular/core'
import { ILine } from './models/production-line'

@Pipe({
    name: 'productionLineFilter'
})

export class ProductionLineFilter implements PipeTransform{
    transform(value: ILine[], args: string[]): ILine[]{
        let filter: string = args[0] ? args[0].toLocaleLowerCase() : null;
        return filter ? value.filter((productLine, IProductionLine) => 
        productLine.lineName.toLocaleLowerCase().indexOf(filter) != -1) : value;
    }
}