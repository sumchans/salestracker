import { Component, OnInit, Inject } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { MatDatepickerInputEvent, MatDialog, MatDialogConfig, MatBottomSheetRef, MAT_BOTTOM_SHEET_DATA } from '@angular/material';
import { BackendServices } from '../services/backendServices.service';
import { PickaddonsComponent } from '../popupdialogs/pickaddons.component';
import { Moment } from 'moment';
import * as moment from 'moment';
import { MessageService } from '../services/MessageService.service';

@Component({
  selector: 'editorder',
  templateUrl: './edit-order.component.html',
  styleUrls: ['./edit-order.component.css'],
})

export class EditOrderComponent implements OnInit {
  editSaleForm: FormGroup;
  editUpgradeForm: FormGroup;
  datePickerInput: any;
  crew: string;
  selectedAddons: string;
  selectedAddonsUpgrade = [] = [];//Used when doing an upgrade on the account.

  constructor(public bs: BackendServices, public sb: MessageService, public pickAddonsDialog: MatDialog, @Inject(MAT_BOTTOM_SHEET_DATA) public passedData: any,
    private bottomSheetRef: MatBottomSheetRef<EditOrderComponent>) {
    /* Code to set the title of the pickaddons button to the addons currently on the account. 
    If no addons are there on the account then the button will have 'PICK ADDONS' as title*/
    if (this.passedData.addons !== null) {
      this.selectedAddons = ((this.passedData.addons).replace(/ /g, ''));
      this.selectedAddonsUpgrade = (this.passedData.addons).split(',');/*This setting for the remembering the previously selected addons when editting an upgrade order
      Also this variable is re-assigned with new addons if user makes changes to the originally selected ones*/
    }
    else { this.selectedAddons = "PICK ADDONS"; }
    ////END
    this.datePickerInput = this.passedData.postDate;//Setting the date to the previously assigned date, for the FFM toggle button.
    this.crew = this.passedData.crew;//Setting the crew to the previously assigned crew, for the crew buttons.
  }

  ngOnInit() {
    this.editSaleForm = new FormGroup({//populating the edit workorder form with pre-selected values
      'id': new FormControl(this.passedData.id),
      'accountNumber': new FormControl(this.passedData.accountNumber, [Validators.required,
      Validators.pattern('[0-9-]*'),
      Validators.minLength(13),
      Validators.maxLength(13)]),
      'customerName': new FormControl(this.passedData.customerName, [Validators.required, Validators.pattern('[a-zA-Z.][a-zA-Z. ]+')]),
      'packageName': new FormControl(this.passedData.packageName),
      'addons': new FormControl(this.passedData.addons),
      'campaignName': new FormControl(this.passedData.campaignName),
      'notes': new FormControl(this.passedData.notes),
      'entryDate': new FormControl(moment().format('ll')),
      'crew': new FormControl(this.passedData.crew),
      'postDate': new FormControl(this.passedData.postDate),
      'status': new FormControl()
    })
    this.editUpgradeForm = new FormGroup({//populating the edit upgrade form with values
      'id': new FormControl(this.passedData.id),
      'accountNumber': new FormControl(this.passedData.accountNumber, [Validators.required,
      Validators.pattern('[0-9-]*'),
      Validators.minLength(13),
      Validators.maxLength(13)]),
      'customerName': new FormControl(this.passedData.customerName, [Validators.required, Validators.pattern('[a-zA-Z.][a-zA-Z. ]+')]),
      'addons': new FormControl(this.passedData.addons),
      'entryDate': new FormControl(moment().format('ll'))
    })
  }
  selectedCampaign(campaign) {
    this.editSaleForm.patchValue({ campaignName: campaign });
  }
  //OPENS ADDONS DIALOG
  openAddonsDialog() {
    const addonsDialogConfig = new MatDialogConfig();
    addonsDialogConfig.disableClose = true;
    addonsDialogConfig.height = 'auto';
    addonsDialogConfig.width = 'auto';
    if (this.selectedAddons !== "PICK ADDONS") {//Converting string to array to send to the dialog.First trimming the spaces, then splitting the array by commas.
      this.selectedAddons = this.selectedAddons.replace(/ /g, '');//remembers the addons selected when the addons dialog is revisited.
      addonsDialogConfig.data = this.selectedAddons.split(',');
    }
    let dialogRef = this.pickAddonsDialog.open(PickaddonsComponent, addonsDialogConfig);
    dialogRef.afterClosed().subscribe((result: string) => {
      if (result === "") { this.selectedAddons = "PICK ADDONS" }
      else {
        this.selectedAddons = result; //for the title of the select addon button.
        this.editSaleForm.patchValue({ addons: (result.replace(/ /g, '')) });
      }
    });
  }
  crewSelected(crew) {
    this.crew = crew;
    //Setting the title of the FFM button toggle to current date for better visual indication, if the crew was not on FFM before
    if (crew === 'FFM') {
      if (this.passedData.crew !== 'FFM') {
        this.datePickerInput = moment().format('ll');
      }
    }
  }
  addEvent(date: MatDatepickerInputEvent<Date>) {//Newly selected date by the user.
    this.datePickerInput = moment(date.value).format('ll');
  }

  //EDIT UPGRADE FORM SECTION/////////////////////////////////////////////////////////////////
  isAddonSelected(addon) { //This method puts checks the addons that were previously selected
    if (this.selectedAddons.length !== 0) {
      return (this.selectedAddons.includes(addon));
    }
  }
  selectAddon(event) {//This method when the user interacts when the addons checkboxes in realtime. 
    if (event.checked) {//adding the selected addon to the selectedAddonsUpgrade array.
      this.selectedAddonsUpgrade.push(event.source.value);
    } else {//removing the addon if it was previously selected
      const i = this.selectedAddonsUpgrade.findIndex(x => x === event.source.value);
      this.selectedAddonsUpgrade.splice(i, 1);
    }
    this.editUpgradeForm.patchValue({ addons: ((this.selectedAddonsUpgrade).toString().replace(/ /g, '')) });
  }
  ////////////////////////////////////////////////////////////////////////////////////////////////
  onEdit() {
    if (this.bs.bottomSheetStartUpMode === 0) {//This section runs if the user edits a workorder
      switch (this.editSaleForm.value.crew) {
        case '8555':
          this.editSaleForm.patchValue({ entryDate: this.passedData.entryDate });
          this.editSaleForm.patchValue({ postDate: this.datePickerInput });
          this.editSaleForm.patchValue({ status: 'tentative' });
          break;
        case '9000':
          this.editSaleForm.patchValue({ postDate: moment().format('ll') });
          this.editSaleForm.patchValue({ status: 'pending' });
          break;
        case '9999':
          this.editSaleForm.patchValue({ postDate: moment().format('ll') });
          this.editSaleForm.patchValue({ status: 'pending' });
          break;
        case 'FFM':
          this.editSaleForm.patchValue({ entryDate: this.passedData.entryDate });
          this.editSaleForm.patchValue({ postDate: this.datePickerInput });
          this.editSaleForm.patchValue({ status: 'pending' });
          break;
      }
      this.editSaleForm.setValue({
        id: this.editSaleForm.value.id,
        accountNumber: this.editSaleForm.value.accountNumber,
        customerName: this.editSaleForm.value.customerName,
        packageName: this.editSaleForm.value.packageName,
        addons: this.editSaleForm.value.addons,
        campaignName: this.editSaleForm.value.campaignName,
        notes: this.editSaleForm.value.notes,
        entryDate: this.editSaleForm.value.entryDate,
        crew: this.editSaleForm.value.crew,
        postDate: this.editSaleForm.value.postDate,
        status: this.editSaleForm.value.status
      });
      this.bs.updateWorkOrder(this.editSaleForm.value)
        .subscribe((response: any) =>
          response = response.json,
          error => console.log(error),
          () => {
            this.bs.getWorkOrders(this.editSaleForm.value.crew);
            this.sb.openSnackBar("Update Successful!", 'Dismiss');
          }
        );
    }
    else if (this.bs.bottomSheetStartUpMode === 1) {//This section runs if the user edits an upgrade
      this.editUpgradeForm.setValue({
        id: this.editSaleForm.value.id,
        accountNumber: this.editUpgradeForm.value.accountNumber,
        customerName: this.editUpgradeForm.value.customerName,
        addons: this.selectedAddonsUpgrade.toString(),
        entryDate: this.editUpgradeForm.value.entryDate,
      });
      this.bs.updateUpgrade(this.editUpgradeForm.value)
        .subscribe((response: any) =>
          console.log(response),
          error => console.log(error),
          () => {
            this.bs.getUpgrades();
            this.sb.openSnackBar("Update Successful!", 'Dismiss');
          }
        );
    }
    this.bottomSheetRef.dismiss();
  }
  onClose() {
    this.bottomSheetRef.dismiss();
  }
}

