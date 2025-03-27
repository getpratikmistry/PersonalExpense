import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { ExpenseService } from '../../services/expense.service';
import { API_STATUS, ApiResponse, Expense } from '../../models/models';
import { DatePipe } from '@angular/common';
import { ConfirmationService, MessageService } from 'primeng/api';
import { firstValueFrom } from 'rxjs';

@Component({
    selector: 'app-expense-list',
    templateUrl: './expense-list.component.html',
    styleUrl: './expense-list.component.scss',
    encapsulation: ViewEncapsulation.None // Allows styles to apply globally
})

export class ExpenseListComponent implements OnInit {
    expenseList: Expense[] = [];
    collectionSize: number = 0;
    expenses: Expense[] = [];

    constructor(private expense_service: ExpenseService, private datepipe: DatePipe,
        private confirmationService: ConfirmationService, private messageService: MessageService) {
    }

    refreshExpenses() {
        this.collectionSize = this.expenseList.length;
        this.expenses = this.expenseList;
    }

    ngOnInit(): void {
        this.LoadExpenses();
    }

    async LoadExpenses() {
        try {
            const response = await firstValueFrom(this.expense_service.getAll<ApiResponse<Expense[]>>())
            if (response.status === API_STATUS.Success.toString() && response.data) {
                this.expenseList = response.data;
                this.expenseList.forEach((item: Expense) => {
                    item.ExpenseDate = this.datepipe.transform(item.ExpenseDate, "yyyy-MM-dd") ?? "";
                });
                this.refreshExpenses();
            }
            else {
                this.messageService.add({ key: "auth", severity: 'error', summary: 'Error', detail: 'There is some issue on server side.', life: 3000 });
            }
        } catch (error) {
            this.messageService.add({ key: "auth", severity: 'error', summary: 'Error', detail: 'There is some issue to display data.', life: 3000 });
        }
    }

    formatCurrency(value: number) {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }

    delete(event: Event, obj: Expense) {
        this.confirmationService.confirm({
            target: event.target as EventTarget,
            message: `Are you sure want to delete this expense of ${obj.CompanyName}`,
            icon: 'pi pi-exclamation-triangle',
            accept: async () => {
                const response = await firstValueFrom(this.expense_service.delete<ApiResponse<Expense[]>>(obj.ExpenseId));
                if (response.status === API_STATUS.Success.toString()) {
                    this.messageService.add({ key: "action-info", severity: 'info', summary: 'Deleted', detail: `Expense deleted successfully.`, life: 3000 });
                    this.LoadExpenses();
                }
                else {
                    this.messageService.add({ key: "auth", severity: 'error', summary: 'Deleted', detail: `There are some issue on deleting Expense.`, life: 3000 });
                }
            },
            reject: () => {
                this.messageService.add({ key: "action-info", severity: 'error', summary: 'Error', detail: 'There is some issue on server side.', life: 3000 });
            }
        });
    }
}
