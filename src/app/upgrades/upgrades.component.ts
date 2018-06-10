import { Component, OnInit } from '@angular/core';
import { BackendServices } from '../services/backendServices.service';
// import { upgradesDataSource } from '../services/databaseOperations';
import { Moment } from 'moment';
import * as moment from 'moment';
import { momentDatePipe } from '../pipes/momentDatePipe.pipe';
import { MatBottomSheetConfig, MatBottomSheet, MatTableDataSource } from '@angular/material';
import { EditOrderComponent } from '../edit-order/edit-order.component';
import { MessageService } from '../services/MessageService.service';
import { IUpgrades } from '../models/interfaces';

@Component({
  selector: 'upgrades',
  templateUrl: './upgrades.component.html',
  styleUrls: ['./upgrades.component.css'],
})
export class UpgradesComponent implements OnInit {
  dataSource = new MatTableDataSource<IUpgrades>();
  selectedRowIndex: number = -1;
  recordsFetched:number = 0;
  columnsToDisplay = ['accountNumber', 'customerName', 'addons', 'entryDate', 'actions']

  constructor(public bs: BackendServices, public bottomSheet: MatBottomSheet, public sb: MessageService) {}

  ngOnInit() {
    this.bs.ugdSubject$.subscribe((data:IUpgrades[]) => {
      this.dataSource = new MatTableDataSource(data);
      this.recordsFetched = data.length;
    });
  }
  selectRow(row) {
    this.selectedRowIndex = row;
  }

  onDelete(upgrade) {
    this.bs.deleteUpgrade(upgrade)
      .subscribe((response: any) =>
        console.log(response),
        error => console.log(error),
        () => { 
          this.bs.getUpgrades();
          this.sb.openSnackBar("Deleted Successfully!", 'Dismiss');
        }
    );
  }
  
  onEditUpgrade(workOrder) {
    this.bs.getPackagesCampaignsAddons()
      .subscribe(data => {
          this.bs.addons = data[2]
      },
        error => console.log(error),
        () => {
          for (let i = 0; i < this.bs.addons.length; i++) { this.bs.addonsCategory.push(this.bs.addons[i].category); }
          this.bs.addonsCategory = Array.from(new Set(this.bs.addonsCategory));//removing duplicates from the array to prepare for the addon headings 
          const bottomSheetConfig = new MatBottomSheetConfig();
          bottomSheetConfig.disableClose = true;
          bottomSheetConfig.data = workOrder;
          this.bottomSheet.open(EditOrderComponent, bottomSheetConfig);
        }
      )
  }
}
