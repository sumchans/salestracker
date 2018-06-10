import { Pipe, PipeTransform } from "@angular/core";
import * as moment from 'moment';

@Pipe({
    name: 'momentDatePipe',
    pure: false
})

export class momentDatePipe implements PipeTransform {
    transform(value: any) {
        let momentDate = moment(value).format('ll');
        return momentDate;

      }
}