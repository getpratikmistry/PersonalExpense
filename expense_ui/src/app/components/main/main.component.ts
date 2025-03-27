import { Component, ViewEncapsulation } from '@angular/core';
import { Store } from '@ngrx/store';
import { MessageService } from 'primeng/api';
import { Company, PriceHistory, ApiResponse, API_STATUS } from '../../models/models';
import { AuthService } from '../../services/auth.service';
import { ExpenseService } from '../../services/expense.service';
import { ExpenseitemService } from '../../services/expenseitem.service';
import { resetCompanyList } from '../../store/company.actions';
import { resetItemList, updatePriceHistory } from '../../store/items.actions';
import { resetLocationList } from '../../store/location.actions';

@Component({
    selector: 'app-main',
    templateUrl: './main.component.html',
    styleUrl: './main.component.scss',
    encapsulation: ViewEncapsulation.None // Allows styles to apply globally
})

export class MainComponent {

    constructor(private expense_service: ExpenseService, private itemservce: ExpenseitemService, private messageService: MessageService,
        private authService: AuthService,
        private store: Store<{ companies: Company[], locations: string[], items: string[], pricehistory: PriceHistory[] }>) {
        this.authService.checkConnection<ApiResponse<string>>().subscribe({
            next: (response: ApiResponse<string>) => {
                if (response.status === API_STATUS.Success.toString()) {
                    try {
                        this.expense_service.getLocations<ApiResponse<{ Locations: string[], Items: string[], Companies: Company[] }>>().subscribe({
                            next: (response: ApiResponse<{ Locations: string[], Items: string[], Companies: Company[] }>) => {
                                this.store.dispatch(resetCompanyList({ cmplist: response.data?.Companies ?? [] }));
                                this.store.dispatch(resetLocationList({ locationList: response.data?.Locations ?? [] }));
                                this.store.dispatch(resetItemList({ itemList: response.data?.Items ?? [] }));
                            },
                            error: (err) => { },
                        });
                    } catch (error) {
                        this.messageService.add({ key: "auth", severity: 'error', summary: 'Error', detail: 'There is some issue  while fetching locations.', life: 3000 });
                    }

                    try {
                        this.itemservce.getitemhistory<ApiResponse<PriceHistory[]>>().subscribe({
                            next: (response2: ApiResponse<PriceHistory[]>) => {
                                if (response2.status === API_STATUS.Success.toString() && response2.data) {
                                    const itemslist = response2.data;
                                    this.store.dispatch(updatePriceHistory({ itemList: itemslist ?? [] }));
                                }
                                else {
                                    this.messageService.add({ key: "auth", severity: 'error', summary: 'Error', detail: 'There is some issue on server side while fetching Item History.', life: 3000 });
                                }
                            },
                            error: (err) => { },
                        });
                    } catch (error) {
                        this.messageService.add({ key: "auth", severity: 'error', summary: 'Error', detail: 'There is some issue while fetching Item History.', life: 3000 });
                    }
                }
            }
        });
    }

}
