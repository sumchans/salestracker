import { Component, OnInit } from '@angular/core';
import { BackendServices } from '../services/backendServices.service';
import { IWorkOrders, IUpgrades, IFinalCountItem } from '../models/interfaces';

@Component({
  selector: 'statsForMonth',
  templateUrl: './statsForMonth.component.html',
  styleUrls: ['./statsForMonth.component.css']
})
export class StatsForMonthComponent implements OnInit {
  wosCount: IWorkOrders[];
  ugdCount: number;
  posted: number;
  pending: number;
  tentative: number;
  canceled: number;
  addons = [];
  addonsCount: number = 0;

  campaigns = [];
  campaignCount= [];
  packages = [];
  packageCount = [];

  constructor(private bs: BackendServices) { }

  ngOnInit() {
    this.bs.wosCount$.subscribe((data: IWorkOrders[]) => {
      this.addons.splice(0, this.addons.length);
      this.addonsCount = 0;
      this.wosCount = data;
      this.posted = ((this.wosCount.filter((x: IWorkOrders) => x.status === 'posted').length));
      this.pending = ((this.wosCount.filter((x: IWorkOrders) => x.status === 'pending').length));
      this.tentative = ((this.wosCount.filter((x: IWorkOrders) => x.status === 'tentative').length));
      this.canceled = ((this.wosCount.filter((x: IWorkOrders) => x.status === 'canceled').length));

      this.addons = ((this.wosCount.filter((x: IWorkOrders) => x.status === 'posted' && x.addons !== "")));
      for (let i = 0; i < this.addons.length; i++) {
        this.addonsCount = this.addonsCount + (this.addons[i].addons).split(",").length;
      }
      //#region Calculating count of campaigns & packages
      this.campaigns.splice(0, this.campaigns.length);
      this.packages.splice(0, this.packages.length);
      for (let i = 0; i < data.length; i++) {
        this.campaigns.push(data[i].campaignName);
        this.packages.push(data[i].packageName);
      }
      this.getCount('campaign', this.campaigns);
      this.getCount('package', this.packages);
       //#endregion
    });
    this.bs.ugdCount$.subscribe((data: IUpgrades[]) => {
      this.ugdCount = data.length;
    });
  }

  getCount(countOf, data = []) {
    if (countOf === 'campaign') {
      this.campaignCount = Object.values(data.reduce((a, c) => {
        (a[c] || (a[c] = { name: c, count: 0 })).count += 1;
        return a;
      }, {})).sort(({ count: ac }, { count: bc }) => bc - ac);
    }

    if (countOf === 'package') {
      this.packageCount = Object.values(data.reduce((a, c) => {
        (a[c] || (a[c] = { name: c, count: 0 })).count += 1;
        return a;
      }, {})).sort(({ count: ac }, { count: bc }) => bc - ac);
    }
  }
}
