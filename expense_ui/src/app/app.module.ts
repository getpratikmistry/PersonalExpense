import { APP_INITIALIZER, NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';

import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';

import { ButtonModule } from 'primeng/button';
import { CommonModule, DatePipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { NavBarComponent } from './components/nav-bar/nav-bar.component';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ExpenseListComponent } from './components/expense-list/expense-list.component';
import { NewExpenseComponent } from './components/new-expense/new-expense.component';
import { SigninComponent } from './components/signin/signin.component';
import { MainComponent } from './components/main/main.component';
import { AuthService } from './services/auth.service';
import { HttpClient, provideHttpClient, withInterceptors } from '@angular/common/http';
import { ConfigService } from './services/config.service';
import { authInterceptor } from './services/auth.interceptor';

import { CheckboxModule } from 'primeng/checkbox';
import { PasswordModule } from 'primeng/password';
import { InputTextModule } from 'primeng/inputtext';
import { MenubarModule } from 'primeng/menubar';
import { Ripple } from 'primeng/ripple';
import { BadgeModule } from 'primeng/badge';
import { AvatarModule } from 'primeng/avatar';
import { MenuModule } from 'primeng/menu';
import { TableModule } from 'primeng/table';
import { CardModule } from 'primeng/card';
import { ConfirmationService, MessageService, PrimeNGConfig } from 'primeng/api';
import { ToastModule } from 'primeng/toast';
import { ConfirmPopupModule } from 'primeng/confirmpopup';
import { CalendarModule } from 'primeng/calendar';
import { AutoCompleteModule } from 'primeng/autocomplete';
import { InputNumberModule } from 'primeng/inputnumber';
import { DropdownModule } from 'primeng/dropdown';
import { DividerModule } from 'primeng/divider';
import { AutoFocusModule } from 'primeng/autofocus';
import { ConfirmDialogModule } from 'primeng/confirmdialog';
import { SplitButtonModule } from 'primeng/splitbutton';
import { InputGroupModule } from 'primeng/inputgroup';
import { PlotlyModule } from 'angular-plotly.js';
import { ItemhistoryComponent } from './components/itemhistory/itemhistory.component';
import { InputGroupAddonModule } from 'primeng/inputgroupaddon';
import { companyReducer } from './store/company.reducer';
import { StoreModule } from '@ngrx/store';
import { StoreDevtoolsModule } from '@ngrx/store-devtools';
import { itemReducer, pricehistoryReducer } from './store/items.reducer';
import { locationReducer } from './store/location.reducer';

export function initializeApp(configService: ConfigService): () => Promise<void> {
    return () => configService.loadConfig();
}

@NgModule({
    declarations: [
        AppComponent,
        DashboardComponent,
        ExpenseListComponent,
        NewExpenseComponent,
        NavBarComponent,
        SigninComponent,
        MainComponent,
        ItemhistoryComponent
    ],
    imports: [
        BrowserModule,
        BrowserAnimationsModule,
        AppRoutingModule, RouterModule,
        StoreModule.forRoot({ companies: companyReducer,
            locations: locationReducer,
            items: itemReducer,
            pricehistory: pricehistoryReducer
         }),
        StoreDevtoolsModule.instrument(),
        ButtonModule, CommonModule, FormsModule, PlotlyModule,
        FormsModule, CheckboxModule, PasswordModule, InputTextModule, MenubarModule, BadgeModule, 
        AvatarModule, Ripple, MenuModule, TableModule, CardModule, ToastModule, ConfirmPopupModule, CalendarModule, AutoCompleteModule,
        InputNumberModule, DropdownModule, DividerModule, AutoFocusModule, ConfirmDialogModule, SplitButtonModule, ToastModule, InputGroupModule,
        InputGroupAddonModule 
    ],
    providers: [{
        provide: APP_INITIALIZER,
        useFactory: initializeApp,
        deps: [ConfigService],
        multi: true
    },
    provideHttpClient(withInterceptors([authInterceptor])),
    DatePipe, AuthService, HttpClient,
    MessageService, ConfirmationService],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(private primengConfig: PrimeNGConfig) {
      this.primengConfig.ripple = true; // Enable ripple effect globally
    }
  }
