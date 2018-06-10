import { Component, Inject } from '@angular/core';
import {MatDialog, MatDialogConfig, MatDialogRef, MAT_DIALOG_DATA, MatCheckbox} from '@angular/material';
import { BackendServices } from '../services/backendServices.service';
import { IAddons } from '../models/interfaces';

@Component({
  selector: 'pickaddons',
  templateUrl: './pickaddons.component.html',
  styleUrls: ['./pickaddons.component.css'],
})

export class PickaddonsComponent {
    selectedAddons = [] = [];//Saving the selected addons for preloading the pickadddons dialog with the selected addons, if re-opened.

    constructor(public dialogRef: MatDialogRef<PickaddonsComponent>, @Inject(MAT_DIALOG_DATA) public data: any, public bs: BackendServices) {
        for (let i = 0; i < this.bs.addons.length; i++) {
            this.bs.addonsCategory.push(this.bs.addons[i].category);
        }
        this.bs.addonsCategory = Array.from(new Set(this.bs.addonsCategory));//removing duplicates from the array to prepare for the addon headings 
        if (data !== null) { this.selectedAddons = data; }// Loading previously selected addons.
    }
    
    isAddonSelected(addon) {
        if (this.selectedAddons.length !== 0) {
            return (this.selectedAddons.includes(addon));//returns true if the addon was previously selected, which puts a checkmark to that addon.
        }
    }
    selectAddon(event) {
        if (event.checked) {//adding the selected addon to the selectedAddons array.
            this.selectedAddons.push(event.source.value);
        } else {//removing the addon that was previously selected
            const i = this.selectedAddons.findIndex(x => x === event.source.value);
            this.selectedAddons.splice(i, 1);
        }
    }
    closeDialog() {
        let addons:string = "";
        if (this.selectedAddons.length !== 0) {
            for (let i = 0; i < this.selectedAddons.length; i++) {
                if (addons === '') { addons = this.selectedAddons[i];}
                else { addons = addons.concat(', ' + this.selectedAddons[i]); }       
            }
        }
        this.dialogRef.close(addons);
    }
}