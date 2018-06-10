import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDatepicker, MatDatepickerInputEvent, MatDialog, MatDialogConfig, MatDialogRef, MatTabChangeEvent } from '@angular/material';
import { BackendServices } from '../services/backendServices.service';
import { IWorkOrders, ICampaigns, IAddons, IPackages } from '../models/interfaces';
import { PickaddonsComponent } from '../popupdialogs/pickaddons.component';
import { Moment } from 'moment';
import * as moment from 'moment';
import { MessageService } from '../services/MessageService.service';
import { forkJoin } from 'rxjs';

@Component({
  selector: 'sales',
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.css'],
})

export class SalesComponent implements OnInit {
  saleForm: FormGroup;
  upgradeForm: FormGroup;
  sidenavStartUpMode: string;
  datePickerInput: any;
  crew: string;
  selectedAddons = "PICK ADDONS";
  selectedAddonsUpgrade = [] = [];//Used when doing an upgrade on the account.

  constructor(public bs: BackendServices, public pickAddonsDialog: MatDialog, private sb: MessageService) {}
  
  ngOnInit() {
    this.saleForm = new FormGroup({//Sale Form Initialization
      'accountNumber': new FormControl('', [Validators.required,
      Validators.pattern('[0-9-]*'),
      Validators.minLength(13),
      Validators.maxLength(13)]),
      'customerName': new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z.][a-zA-Z. ]+')]),
      'packageName': new FormControl('', Validators.required),
      'addons': new FormControl(),
      'campaignName': new FormControl('', Validators.required),
      'notes': new FormControl(''),
      'entryDate': new FormControl(moment().format('ll')),
      'crew': new FormControl('', Validators.required),
      'postDate': new FormControl(''),
      'status': new FormControl()
    })
    this.upgradeForm = new FormGroup({//Upgrade Form Initialization
      'accountNumber': new FormControl('', [Validators.required,
      Validators.pattern('[0-9-]*'),
      Validators.minLength(13),
      Validators.maxLength(13)]),
      'customerName': new FormControl('', [Validators.required, Validators.pattern('[a-zA-Z.][a-zA-Z. ]+')]),
      'entryDate': new FormControl(moment().format('ll')),
      'addons': new FormControl()
    })
  }
  onTabClick(tab: MatTabChangeEvent) {
    this.bs.bottomSheetStartUpMode = tab.index;
  }
  //#region SIDENAV OPEN & CLOSE
  sidenavOpen(sidenavStartMode, sidenav) {
    this.bs.getPackagesCampaignsAddons()
      .subscribe(data => {
        this.bs.packages = data[0],
          this.bs.campaigns = data[1],
          this.bs.addons = data[2]
      },
        error => console.log(error),
        () => { //After loading the bs.addons with data the below for loop removes the duplicate addon categories.
          for (let i = 0; i < this.bs.addons.length; i++) { this.bs.addonsCategory.push(this.bs.addons[i].category); }
          this.bs.addonsCategory = Array.from(new Set(this.bs.addonsCategory));//removing duplicates from the array to prepare for the addon headings 
          sidenav.open();
        }
      )
    switch (sidenavStartMode) {
      case 'sale':
        this.sidenavStartUpMode = 'sale';//this setting helps starting up the sale form for tracking
        break;
      case 'upgrade':
        this.sidenavStartUpMode = 'upgrade';////this setting helps starting up the upgrade form for tracking.
        break;
    }
  }
  sidenavClose(sidenav) {
    this.selectedAddonsUpgrade.splice(0, this.selectedAddonsUpgrade.length);//clearing the previously selected addons when sidenav closes.
    sidenav.close();
  }
//#endregion

  selectedCampaign(campaign) {
    this.saleForm.patchValue({ campaignName: campaign });
  }
  crewSelected(crew) {
    this.crew = crew;
  }
  addEvent(date: MatDatepickerInputEvent<Date>) {
    this.datePickerInput = date.value;
    // console.log(this.datePickerInput);
  }
  //Pick Addons Section
  openAddonsDialog() {
    const addonsDialogConfig = new MatDialogConfig();
    addonsDialogConfig.disableClose = true;
    addonsDialogConfig.height = 'auto';
    addonsDialogConfig.width = 'auto';
    addonsDialogConfig.position = { left: '320px' };
    if (this.selectedAddons !== "PICK ADDONS") {//Converting string to array to send to the dialog.First trimming the spaces, then splitting the array by commas.
      this.selectedAddons = this.selectedAddons.replace(/ /g, '');
      addonsDialogConfig.data = this.selectedAddons.split(',');
    }
    //Preloading the data for the addons dialog for faster opening
    this.bs.getPackagesCampaignsAddons()
      .subscribe(data => {
        this.bs.addons = data[2]
      },
        error => console.log(error),
        () => {
          let dialogRef = this.pickAddonsDialog.open(PickaddonsComponent, addonsDialogConfig);
          dialogRef.afterClosed().subscribe((result: string) => {
            if (result === "") { this.selectedAddons = "PICK ADDONS" }
            else {
              this.selectedAddons = result; //for the title of the select addon button.
              this.saleForm.patchValue({ addons: (result.replace(/ /g, '')) });
            }
          });
        }
      )
  }

  //UPGRADE FORM SECTION
  selectAddon(event) {
    if (event.checked) {//adding the selected addon to the selectedAddonsUpgrade array.
      this.selectedAddonsUpgrade.push(event.source.value);
    } else {//removing the addon if it was previously selected
      const i = this.selectedAddonsUpgrade.findIndex(x => x === event.source.value);
      this.selectedAddonsUpgrade.splice(i, 1);
    }
    this.upgradeForm.patchValue({ addons: ((this.selectedAddonsUpgrade).toString().replace(/ /g, '')) });
  }
  onSaleOrUpgrade() {
    if (this.sidenavStartUpMode === 'sale') {
      switch (this.saleForm.value.crew) {
        case '8555':
          this.saleForm.patchValue({ postDate: this.datePickerInput });
          this.saleForm.patchValue({ status: 'tentative' });
          break;
        case '9000':
          this.saleForm.patchValue({ postDate: moment().format('ll') });
          this.saleForm.patchValue({ status: 'pending' });
          break;
        case '9999':
          this.saleForm.patchValue({ postDate: moment().format('ll') });
          this.saleForm.patchValue({ status: 'pending' });
          break;
        case 'FFM':
          this.saleForm.patchValue({ postDate: this.datePickerInput });
          this.saleForm.patchValue({ status: 'pending' });
          break;
      }
      this.saleForm.setValue({
        accountNumber: this.saleForm.value.accountNumber,
        customerName: this.saleForm.value.customerName,
        packageName: this.saleForm.value.packageName,
        addons: this.saleForm.value.addons,
        campaignName: this.saleForm.value.campaignName,
        notes: this.saleForm.value.notes,
        entryDate: this.saleForm.value.entryDate,
        crew: this.saleForm.value.crew,
        postDate: this.saleForm.value.postDate,
        status: this.saleForm.value.status
      });
      this.bs.postWorkOrder(this.saleForm.value)
      .subscribe((response:any) => response = response.json,
          error => console.log(error),
          () => {
            this.bs.getWorkOrders(this.saleForm.value.crew);
            this.sb.openSnackBar("Sale Tracked Successfully!", 'Dismiss');
          }
        );
        
    }
    else if (this.sidenavStartUpMode === 'upgrade') {
      console.log(this.sidenavStartUpMode);
      this.upgradeForm.setValue({
        accountNumber: this.upgradeForm.value.accountNumber,
        customerName: this.upgradeForm.value.customerName,
        addons: this.upgradeForm.value.addons,
        entryDate: this.upgradeForm.value.entryDate,
      });
      this.bs.postUpgrade(this.upgradeForm.value)
      .subscribe((response:any) => response = response.json,
          error => console.log(error),
          () => {
            this.bs.getUpgrades();
            this.sb.openSnackBar("Upgrade Tracked Successfully!", 'Dismiss');
          }
        );
    }
  }
}
