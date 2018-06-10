import { BrowserModule } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//Moment implementation for the datepicker
import { MatMomentDateModule, MomentDateAdapter } from '@angular/material-moment-adapter';
import { DateAdapter, MAT_DATE_FORMATS, MAT_DATE_LOCALE, MAT_LABEL_GLOBAL_OPTIONS } from '@angular/material/core';

import {
  MatTableModule,
  MatCardModule,
  MatInputModule,
  MatButtonModule,
  MatSelectModule,
  MatRadioModule,
  MatDatepickerModule,
  MatToolbarModule,
  MatDividerModule,
  MatIconModule,
  MatTooltipModule,
  MatTabsModule,
  MatDialogModule,
  MatSidenavModule,
  MatCheckboxModule,
  MatExpansionModule,
  MatButtonToggleModule,
  MatSnackBarModule,
  MatBottomSheetModule,
} from '@angular/material'

import { HttpClientModule } from '@angular/common/http';
import { ReactiveFormsModule } from '@angular/forms';
import { AppComponent } from './app.component';
import { OrdersComponent } from './orders/orders.component';
import { UpgradesComponent } from './upgrades/upgrades.component';
import { SalesComponent } from './sales/sales.component';
import { BackendServices } from './services/backendServices.service';
import { PickaddonsComponent } from './popupdialogs/pickaddons.component';
import 'hammerjs'; // to add gesture support to some material components
import { momentDatePipe } from './pipes/momentDatePipe.pipe';
import { woStatusPipe } from './pipes/woStatusPipe.pipe';
import { addonsSpaceAddPipe } from './pipes/addonSpaceAddPipe.pipe';
import { MessageService } from './services/MessageService.service';
import { EditOrderComponent } from './edit-order/edit-order.component';
import { StatsForMonthComponent } from './statistics/statsForMonth.component';
import { CommonModule } from '@angular/common';

//Moment Date parser for the Datepicker
export const MY_FORMATS = {
  parse: {
    dateInput: 'LL',
  },
  display: {
    dateInput: 'LL',
    monthYearLabel: 'MMM YYYY',
    dateA11yLabel: 'LL',
    monthYearA11yLabel: 'MMMM YYYY',
  },
};
//End

@NgModule({
  declarations: [
    AppComponent,
    OrdersComponent,
    SalesComponent,
    UpgradesComponent,
    PickaddonsComponent,
    EditOrderComponent,
    momentDatePipe,
    woStatusPipe,
    addonsSpaceAddPipe,
    StatsForMonthComponent,
  ],
  imports: [
    BrowserModule,
    CommonModule,
    BrowserAnimationsModule,
    HttpClientModule,
    ReactiveFormsModule,
    MatTableModule,
    MatCardModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatRadioModule,
    MatDatepickerModule,
    MatMomentDateModule,
    MatToolbarModule,
    MatDividerModule,
    MatIconModule,
    MatTooltipModule,
    MatTabsModule,
    MatDialogModule,
    MatSidenavModule,
    MatCheckboxModule,
    MatExpansionModule,
    MatButtonToggleModule,
    MatSnackBarModule,
    MatBottomSheetModule,
  ],
  entryComponents: [PickaddonsComponent, EditOrderComponent
  ],

  providers: [BackendServices, MessageService, momentDatePipe, woStatusPipe, addonsSpaceAddPipe,
    { provide: MAT_LABEL_GLOBAL_OPTIONS, useValue: { float: 'never' } },
    //Moment Datepicker providers
    { provide: DateAdapter, useClass: MomentDateAdapter, deps: [MAT_DATE_LOCALE] },
    { provide: MAT_DATE_FORMATS, useValue: MY_FORMATS },
    //End
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
