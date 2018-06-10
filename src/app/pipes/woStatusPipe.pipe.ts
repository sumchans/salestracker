import { Pipe, PipeTransform } from "@angular/core";
import { Moment } from 'moment';
import * as moment from 'moment';

@Pipe({
    name: 'woStatusPipe',
    pure: false
})

export class woStatusPipe implements PipeTransform {
    transform(value: any) {
        let woStatus: string; 
        if (value === 'FFM') { woStatus = 'FFM';}
        else { woStatus = value; }
        return woStatus;
      }
}
