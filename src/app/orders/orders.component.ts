import { Component, OnInit, ViewChild } from '@angular/core';
import { MatBottomSheet, MatBottomSheetConfig, MatTableDataSource, MatButton } from '@angular/material';
import { BackendServices } from '../services/backendServices.service';
import { IWorkOrders } from '../models/interfaces';
import { MessageService } from '../services/MessageService.service';
import { EditOrderComponent } from '../edit-order/edit-order.component';

@Component({
  selector: 'orders',
  templateUrl: './orders.component.html',
  styleUrls: ['./orders.component.css'],
})
export class OrdersComponent implements OnInit { 
  dataSource = new MatTableDataSource<IWorkOrders>();
  selectedRowIndex: number = -1;
  accountAddonsCount = [];
  recordsFetched: number;
  clearFiltersVisibility: boolean;
  filterButtons = [
    { text: 'Posted', isClicked: false },
    { text: 'FFM', isClicked: false },
    { text: '9999', isClicked: false },
    { text: '9000', isClicked: false },
    { text: '8555', isClicked: false },
    { text: 'Canceled', isClicked: false },
  ]
  columnsToDisplay = ['accountNumber','customerName','packageName','campaignName','entryDate','postDate','notes','actions']
  constructor(private bs: BackendServices, private bottomSheet: MatBottomSheet, private sb: MessageService) {}  

  ngOnInit() {
    this.bs.wosSubject$.subscribe((data:IWorkOrders[]) => {
      switch (this.bs.saleCrew) {
        case 'posted':
          this.dataSource = new MatTableDataSource(data.filter((x: IWorkOrders) => x.status === this.bs.saleCrew));
          this.clearFiltersVisibility = true;
          break;
        case 'FFM':
          this.dataSource = new MatTableDataSource(data.filter((x: IWorkOrders) => x.crew === this.bs.saleCrew && x.status === 'pending'));
          this.clearFiltersVisibility = true;
          break;
        case '9999':
          this.dataSource = new MatTableDataSource(data.filter((x: IWorkOrders) => x.crew === this.bs.saleCrew && x.status === 'pending'));
          this.clearFiltersVisibility = true;
          break;
        case '9000':
          this.dataSource = new MatTableDataSource(data.filter((x: IWorkOrders) => x.crew === this.bs.saleCrew && x.status === 'pending'));
          this.clearFiltersVisibility = true; 
          break;
        case '8555':
          this.dataSource = new MatTableDataSource(data.filter((x: IWorkOrders) => x.crew === this.bs.saleCrew && x.status === 'tentative'));
          this.clearFiltersVisibility = true;
          break;
        case 'canceled':
          this.dataSource = new MatTableDataSource(data.filter((x: IWorkOrders) => x.status === this.bs.saleCrew));
          this.clearFiltersVisibility = true;
          break;
        case 'clearFilters':
          this.dataSource = new MatTableDataSource(data);
          this.clearFiltersVisibility = false;
          break;
      }
      this.recordsFetched = this.dataSource.data.length;
    });
  }
  //#region View Logic
  selectRow(row) {
    this.selectedRowIndex = row;
  }
  applyFilter(filterValue: string) {
    filterValue = filterValue.trim();
    filterValue = filterValue.toLowerCase();
    this.dataSource.filter = filterValue;
  }

  isAddonsAttached(addons) {//Checking if addons are attached to the workorder
    if (addons === null) { return false; }
    else {  
      this.accountAddonsCount = addons.split(",");
      return true;
    }
  }
  isShowPost(crew, status) {
    if (crew === '8555') { return false; } 
    else if (status === 'posted' || status === 'canceled') { return false; } 
    else return true;
  }
  isShowCancel(status) {
    if (status === 'posted' || status === 'canceled') { return false; }
    else return true;
  }
//#endregion
  onCrewFilter(crew) {
    // console.log(crew.toLowerCase());
    let filter = this.bs.wosSubject$.getValue();
    switch (crew) {
      case 'posted':
      filter = filter.filter((x: IWorkOrders) => x.status === crew);
      this.clearFiltersVisibility = true;
      break;
      case 'FFM':
      filter = filter.filter((x:IWorkOrders) => x.crew === crew && x.status === 'pending');
      this.clearFiltersVisibility = true;
      break;
      case '9999':
      filter = filter.filter((x:IWorkOrders) => x.crew === crew && x.status === 'pending');
      this.clearFiltersVisibility = true;
      break;
      case '9000':
      filter = filter.filter((x:IWorkOrders) => x.crew === crew && x.status === 'pending');
      this.clearFiltersVisibility = true;
      break;
      case '8555':
      filter = filter.filter((x:IWorkOrders) => x.crew === crew && x.status === 'tentative');
      this.clearFiltersVisibility = true;
      break;
      case 'canceled':
      filter = filter.filter((x: IWorkOrders) => x.status === crew);
      this.clearFiltersVisibility = true;
      break;
      case 'clearFilters':
      this.clearFiltersVisibility = false;
      break;
    }
    this.recordsFetched = filter.length;
    this.dataSource = new MatTableDataSource(filter);
  }  
//#region ACTIONS
  onPostOff(workOrder) {
    workOrder.status = 'posted';
    this.bs.postOrCancelWorkOrder(workOrder)
      .subscribe((response: any) =>
        response = response.json,
        error => console.log(error),
        () => {
          this.bs.getWorkOrders('posted');
          this.sb.openSnackBar("Posted Successfully!", 'Dismiss');
        }
      );
  }
  onEdit(workOrder) {
    //Preloading the packages, campaigns & addons in the services files before loading the sidenav.
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
          const bottomSheetConfig = new MatBottomSheetConfig();
          bottomSheetConfig.disableClose = true;
          bottomSheetConfig.data = workOrder;
          let bottomSheetRef = this.bottomSheet.open(EditOrderComponent, bottomSheetConfig);
          bottomSheetRef.afterDismissed().subscribe(() => {
            this.sb.openSnackBar("Updated Successfully!", 'Dismiss');
          }
          )
        }
      )
  }
  canceled(workOrder) {
    workOrder.status = 'canceled';
    this.bs.postOrCancelWorkOrder(workOrder)
      .subscribe((response: any) =>
        response = response.json,
        error => console.log(error),
        () => { 
          this.bs.getWorkOrders('canceled');
          this.sb.openSnackBar("Order Canceled Successfully!", 'Dismiss');
        }
    );
  }
  //#endregion
}