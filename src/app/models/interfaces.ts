export interface IWorkOrders {
    id:number;
    accountNumber: string;
    customerName: string;
    packageName: string;
    addons:any;
    campaignName: string;
    notes: string;
    entryDate: Date;
    crew: string;
    postDate: Date;
    status: string;
}

export interface IUpgrades {
    id:number;
    accountNumber: string;
    customerName: string;
    addons:any;
    entryDate: Date;
}

export class ICampaigns {
    id:number;
    campaignName: string;
}

export class IPackages {
    id:number;
    cbsCode: string;
    packageName: string;
    price: number;
}

export class IAddons {
    id:number;
    cbsCode: string;
    addonName: string;
    price: number;
    category: string;
}
export interface IFinalCountItem extends Array<any> {
    campaign: string;
    count: number;
  }