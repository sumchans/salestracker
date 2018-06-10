import { Pipe, PipeTransform } from "@angular/core";

@Pipe({
    name: 'addonsSpaceAddPipe',
    pure: false
})

export class addonsSpaceAddPipe implements PipeTransform {
    transform(value: any) {
        let addons: string = "";
        value = value.split(',');
        if (value.length !== 0) {
            for (let i = 0; i < value.length; i++) {
                if (addons === '') { addons = value[i];}
                else { addons = addons.concat(', ' + value[i]); }       
            }
        }
        return addons;
    }
}
