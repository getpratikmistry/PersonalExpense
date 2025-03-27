import { Component, OnInit, ViewEncapsulation } from '@angular/core';
import { API_STATUS, ApiResponse, Company, Expense, ExpenseItem, optionUnits, UNIT_OPTIONS } from '../../models/models';
import { DatePipe } from '@angular/common';
import { ActivatedRoute, Router } from '@angular/router';
import { ExpenseService } from '../../services/expense.service';
import { Observable, of, switchMap, tap } from 'rxjs';
import { ConfirmationService, MessageService } from 'primeng/api';
import { AutoCompleteSelectEvent } from 'primeng/autocomplete';
import { Store } from '@ngrx/store';

@Component({
    selector: 'app-new-expense',
    templateUrl: './new-expense.component.html',
    styleUrl: './new-expense.component.scss',
    encapsulation: ViewEncapsulation.None // Allows styles to apply globally
})

export class NewExpenseComponent implements OnInit {

    title = "New Expense";
    btnName: string = "Add";
    newRowPrefix: string = "NEW";
    rowCounter: number = 1;
    unitSelect = UNIT_OPTIONS;
    companySelect: Company[] = [];
    filteredCompanies: Company[] = [];
    curruntRowIndex: string = "";
    id!: string;

    items: ExpenseItem[] = [];
    itemSelect: string[] = [];
    filteredItems: ExpenseItem[] = [];

    localDate: string = "";
    localDateTime: string = "";

    expense: Expense = this.loadnewExpense();
    listLocation: string[] = [];
    filteredLocation: string[] = [];

    itemName: string = "";
    unit: string = UNIT_OPTIONS[0].value;
    portion: number = 0;
    amount: number = 0;

    itemFocus = false;

    companies$: Observable<Company[]>;
    locations$: Observable<string[]>;
    items$: Observable<string[]>;

    constructor(private route: ActivatedRoute, private expense_service: ExpenseService, private router: Router, private datepipe: DatePipe, 
            private confirmationService: ConfirmationService, private messageService: MessageService,
            private store: Store<{ companies: Company[], locations: string[], items: string[] }>) {
        this.localDate = this.datepipe.transform(new Date().toISOString(), "yyyy-MM-dd") ?? "";
        this.localDateTime = this.datepipe.transform(new Date().toISOString().replace(",", ""), "yyyy-MM-dd HH:mm:ss") ?? "";
        this.companies$ = this.store.select('companies'); // Select employees state
        this.locations$ = this.store.select('locations'); // Select employees state
        this.items$ = this.store.select('items'); // Select employees state
    }

    searchCompany(event: any) {
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.companySelect.length; i++) {
            const country = this.companySelect[i];
            if (country.CompanyName.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(country);
            }
        }
        this.filteredCompanies = filtered;
    }

    searchLocation(event: any) {
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.listLocation.length; i++) {
            const loc = this.listLocation[i];
            if (loc.toLowerCase().indexOf(query.toLowerCase()) == 0) {
                filtered.push(loc);
            }
        }
        this.filteredLocation = filtered;
    }

    searchItem(event: any) {
        const filtered: any[] = [];
        const query = event.query;
        for (let i = 0; i < this.itemSelect.length; i++) {
            const item = this.itemSelect[i];
            if (item.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
                filtered.push(item);
            }
        }
        this.filteredItems = filtered;
    }

    ngOnInit(): void {
        this.resetItemControls();
        this.generateNewRowId();

        this.route.paramMap
            .pipe(
                tap((params) => {
                    this.id = params.get('id') || '0';
                }),
                switchMap((params) => {
                    const expense_id = parseInt(this.id, 0);
                    if (expense_id > 0) {
                        return this.expense_service.get<ApiResponse<Expense>>(expense_id);
                    } else {
                        this.expense = this.loadnewExpense();
                        return of(null);
                    }
                }),
                tap((response: ApiResponse<Expense> | null) => {
                    if (response && response.status === API_STATUS.Success && response.data) {
                        const expense = response.data;
                        expense.ExpenseDate = expense.ExpenseDate.split("T")[0];
                        this.expense = expense;

                        expense.ExpenseItems?.forEach((item: ExpenseItem) => {
                            item.id = item.ItemId.toString();
                        });
                        
                        this.expense.CompanyName = this.companySelect.find((x: any) => {
                            return x.CompanyId == this.expense.CompanyId;
                        })?.CompanyName ?? "";

                        this.loadExpenseItemTable(expense.ExpenseItems);
                        this.calculateNetAmount();
                    }
                })
            )
            .subscribe({
                error: (err) => this.messageService.add({ key: "auth", severity: 'info', summary: 'Error', detail: err.message }),
        });

        this.companies$.subscribe({
            next: (companies: Company[]) => {
                this.companySelect = companies ?? [];
            }
        });

        this.locations$.subscribe({
            next: (companies: string[]) => {
                this.listLocation = companies ?? [];
            }
        });

        this.items$.subscribe({
            next: (companies: string[]) => {
                this.itemSelect = companies ?? [];
            }
        });
    }

    onCompanySelect(event: AutoCompleteSelectEvent) {
        this.expense.CompanyId = event.value.CompanyId;
        this.expense.Location = event.value.Location;
    }

    edit(item: ExpenseItem) {
        this.btnName = "Update";
        this.curruntRowIndex = item.id;
        this.itemName = item.Itemname;
        
        this.unit = UNIT_OPTIONS.find((x: optionUnits) => {
            return x.value == item.UnitId.toString();
        })?.value ?? UNIT_OPTIONS[0].value;
        this.portion = item.Quantity;
        this.amount = item.Amount;
    }

    deleteItem(event: Event, item: ExpenseItem) {
        const index = this.items.findIndex((x: ExpenseItem) => x.id === item.id);
        if (index === -1) {
            alert("Item not found.");
            return;
        }
        const selectedItem = this.items[index];
        
        this.confirmationService.confirm({
            key: "popup",
            target: event.target as EventTarget,
            message: `Are you sure you want to delete ${selectedItem.Itemname?.toUpperCase() || 'this item'}?`,
            icon: 'pi pi-exclamation-triangle',
            accept: () => {
                if (selectedItem.ItemId === 0) {
                    this.items.splice(index, 1);
                } else {
                    selectedItem.Flag = -1;
                }

                this.loadExpenseItemTable(this.items);
                this.calculateNetAmount();
            },
            reject: () => {
                return;
            }
        });
        return;
    }

    addItem() {
        if (this.itemName == null || this.itemName.trim() === "") {
            alert("Please check item name");
            return;
        }
        if (!this.validataNumber(this.portion)) {
            alert("Please check item portion");
            return;
        }
        if (!this.validataNumber(this.amount)) {
            alert("Please check item amount");
            return;
        }

        if (this.curruntRowIndex === "") {
            this.items.push({
                ExpenseId: this.expense.ExpenseId,
                ItemId: 0,
                Itemname: this.itemName.toUpperCase(),
                UnitId: parseInt(this.unit),
                Quantity: this.portion,
                Amount: this.amount,
                PPU: 0,
                id: this.generateNewRowId()
            });
        }
        else {
            const i = this.items.findIndex(x => x.id === this.curruntRowIndex);

            if (i > -1) {
                this.items[i].Itemname = this.itemName.toUpperCase();
                this.items[i].UnitId = parseInt(this.unit);
                this.items[i].Quantity = this.portion;
                this.items[i].Amount = this.amount;
            } else {
                console.error(`Item with id ${this.curruntRowIndex} not found`);
            }
        }
        this.loadExpenseItemTable(this.items);
        this.calculateNetAmount();
        this.resetItemControls();
        this.itemFocus = true;
    }

    addDisplayInformation(obj: ExpenseItem): ExpenseItem {
        obj.UnitLabel = this.unitSelect.find(x => x.value == obj.UnitId.toString())?.option;
        obj.QuantityLabel = obj.Quantity?.toString() + " " + this.unitSelect.find(x => x.value == obj.UnitId.toString())?.displayUnit;
        obj.AmountLabel = "$" + obj.Amount;

        obj.PPU = parseFloat((obj.Amount / obj.Quantity).toFixed(3))

        return obj;
    }

    onComapnyChange(obj: any) {
        this.expense.Location = this.companySelect.find(x => x.CompanyId === parseInt(obj.target.value))?.Location ?? "";
    }

    calculateNetAmount() {
        let totalAmt = 0;
        this.items.forEach((acc) => { totalAmt = acc.Flag == -1 ? 0 : (acc.Amount + totalAmt); });
        this.expense.SubTotalAmount = totalAmt;
        this.expense.NetAmount = this.expense.SubTotalAmount + this.expense.TaxAmount - this.expense.Discount;
    }

    onUnitChange() {
        // this.unitLabel = UNIT_OPTIONS.find(x => x.value === this.unit.toString())?.displayUnit ?? "Unit";
    }

    resetItemControls() {
        this.itemName = "";
        this.unit = UNIT_OPTIONS[0].value;
        this.portion = 0;
        this.amount = 0;
        this.btnName = "Add";
        this.curruntRowIndex = "";
        this.onUnitChange();
    }

    generateNewRowId(): string {
        return this.newRowPrefix + (this.rowCounter++).toString();
    }

    loadExpenseItemTable(list: ExpenseItem[]) {
        list.forEach((x: ExpenseItem) => this.addDisplayInformation(x));
        this.items = list;
    }

    saveExpense(event: Event) {
        if (!this.validateInformation()) {
            return;
        }

        this.expense.ExpenseItems = this.items;
        let obs = this.expense.ExpenseId > 0 ? this.expense_service.update<ApiResponse<Expense>>(this.expense) : this.expense_service.create<ApiResponse<Expense>>(this.expense);
        obs.subscribe({
            next: (x: ApiResponse<Expense>) => {
                if (x.status == API_STATUS.Success) {

                    this.confirmationService.confirm({
                        key: "dialog",
                        message: 'Data saved, Do you want to add new expense?',
                        header: 'Expense Saved',
                        acceptIcon:"none",
                        rejectIcon:"none",
                        rejectButtonStyleClass:"p-button-text",
                        accept: () => {
                            this.router.navigate(["/main/newexpense/0"]);
                            this.expense = this.loadnewExpense();
                            this.messageService.add({ severity: 'info', summary: 'Confirmed', detail: 'You have accepted' });
                        },
                        reject: () => {
                            this.router.navigate(["/main/expenselist"]);
                            this.messageService.add({ severity: 'error', summary: 'Rejected', detail: 'You have rejected', life: 3000 });
                        }
                    });
                }
                else {
                    this.messageService.add({ severity: 'error', summary: 'Not Saved', detail: "Error: not saved", life: 3000 });
                }
            }
        })
    }

    loadnewExpense() {
        this.items = [];
        return {
            ExpenseId: 0,
            ExpenseDate: this.localDate,
            CompanyId: 0,
            CompanyName: '',
            Location: '',
            Tax: 0,
            TaxAmount: 0,
            SubTotalAmount: 0,
            NetAmount: 0,
            IsAmountModified: false,
            CreatedBy: 1,
            CreatedDate: this.localDateTime,
            UpdatedBy: 1,
            UpdatedDate: this.localDateTime,
            ExpenseItems: [],
            Discount: 0
        };
    }

    validateInformation() {
        if (this.expense.CompanyId == 0) {
            alert("Please select store");
            return false;
        }
        if (this.expense.Location.trim() === "") {
            alert("Please select store location");
            return false;
        }
        if (this.expense.TaxAmount == null) {
            alert("Please enter tax amount.");
            return false;
        }
        if (isNaN(this.expense.TaxAmount)) {
            alert("Please enter tax amount.");
            return false;
        }
        if (this.expense.TaxAmount < 0) {
            alert("Please select tax amount cannot be less than zero.");
            return false;
        }
        if (isNaN(this.expense.Discount)) {
            alert("Please enter discount amount.");
            return false;
        }
        if (this.expense.Discount == null) {
            alert("Please enter discount amount.");
            return false;
        }
        if (isNaN(this.expense.Discount)) {
            alert("Please enter discount amount.");
            return false;
        }
        if (this.expense.Discount < 0) {
            alert("Please select discount amount cannot be less than zero.");
            return false;
        }
        if (this.items.length === 0) {
            alert("Please add items in the item list.");
            return false;
        }
        this.expense.Tax = 0;

        return true;
    }

    validataNumber(val: number | undefined): boolean {
        if (val == null) {
            return false;
        }
        if (isNaN(val)) {
            return false;
        }
        if (isNaN(val)) {
            return false;
        }
        if (val < 0) {
            return false;
        }
        return true;
    }
}

interface listOptions {
    Locations: string[],
    Items: string[],
    Companies: Company[]
}
