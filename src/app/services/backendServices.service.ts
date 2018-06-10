import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { IWorkOrders, ICampaigns, IPackages, IAddons, IUpgrades } from '../models/interfaces';
import { Observable, BehaviorSubject, forkJoin, of, Subject } from 'rxjs';
import { tap } from 'rxjs/operators';

@Injectable()
export class BackendServices {
  // private BASE_URL = 'http://localhost:8080/backend'
  private BASE_URL = 'https://infra-mechanic-206200.appspot.com/backend'
  private cache: any;//Used to cache packages, campaigns & addons data
  bottomSheetStartUpMode: number = 0;//To initiate the editSale or editUpgrade form.'0' means editSaleForm
  saleCrew: string; //Used to move to the crew section on which the sale was made. Used in orders component
  
  public wosSubject$ = new BehaviorSubject<IWorkOrders[]>([]);
  public wosCount$ = new Subject<IWorkOrders[]>();
  public ugdSubject$ = new BehaviorSubject<IUpgrades[]>([]);
  public ugdCount$ = new Subject<IUpgrades[]>();
  public campaignCount = [];
  public packageCount = [];

  packages: IPackages[];
  campaigns: ICampaigns[];
  addons: IAddons[];
  addonsCategory: any = [];

  constructor(private http: HttpClient) { 
      this.getWorkOrders('clearFilters');
      this.getUpgrades();    
  }

  //#region WORKORDER Maintenance
  getWorkOrders(crew) {
    this.http.get(this.BASE_URL + '/getworkorders/')
      .subscribe((data: IWorkOrders[]) => {
        this.saleCrew = crew;
        this.wosSubject$.next(data);
      },
        error => console.log(error),
        () => {
          this.wosCount$.next(this.wosSubject$.getValue());
        }
      );
  }
  postWorkOrder(workOrder: IWorkOrders) {
    return this.http.post<IWorkOrders>(this.BASE_URL + '/addworkorder/', workOrder);
  }
  updateWorkOrder(workOrder) {
    return this.http.put<IWorkOrders>(this.BASE_URL + '/updateworkorder/' + workOrder.id, workOrder);
  }
  deleteWorkOrder(workOrder) {
    return this.http.delete<IWorkOrders>(this.BASE_URL + '/deleteworkorder/' + workOrder.id);
  }
  postOrCancelWorkOrder(workOrder) {
    return this.http.put<IWorkOrders>(this.BASE_URL + '/postworkorder/' + workOrder.id, workOrder);
  }
  //#endregion

  //#region UPGRADE ORDERS MAINTENANCE
  getUpgrades() {
    this.http.get(this.BASE_URL + '/getupgrades/')
    .subscribe((data: IUpgrades[]) => 
      this.ugdSubject$.next(data),
      error => console.log(error),
      () => {
        this.ugdCount$.next(this.ugdSubject$.getValue());
      }
    );
  }
  postUpgrade(upgrade: IUpgrades) {
    return this.http.post<IUpgrades>(this.BASE_URL + '/addupgrade/', upgrade);
  }
  updateUpgrade(upgrade) {
    return this.http.put<IUpgrades>(this.BASE_URL + '/updateupgrade/' + upgrade.id, upgrade);
  }
  deleteUpgrade(upgrade) {
    return this.http.delete<IUpgrades>(this.BASE_URL + '/deleteupgrade/' + upgrade.id)
  }
  //#endregion

  //#region DATABASE Maintenance
  getPackagesCampaignsAddons(): Observable<any> {
    if (this.cache) {//Checking if it's the first time load, if not the else part will run.
      return of(this.cache);
    } else {
      return forkJoin(
        this.http.get<IPackages[]>(this.BASE_URL + '/packages/'),
        this.http.get<ICampaigns[]>(this.BASE_URL + '/campaigns/'),
        this.http.get<IAddons[]>(this.BASE_URL + '/addons/')
      ).pipe(
        tap(data => this.cache = data));
    }
  }
  //#endregion
}
