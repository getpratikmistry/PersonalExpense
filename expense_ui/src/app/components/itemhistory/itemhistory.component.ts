import { AfterViewInit, Component, ElementRef, ViewChild, ViewEncapsulation } from '@angular/core';
import { PriceHistory } from '../../models/models';
import { DatePipe } from '@angular/common';
import { Store } from '@ngrx/store';
import { debounceTime, distinctUntilChanged, fromEvent, map } from 'rxjs';

@Component({
    selector: 'app-itemhistory',
    templateUrl: './itemhistory.component.html',
    styleUrl: './itemhistory.component.scss',
    encapsulation: ViewEncapsulation.None // Allows styles to apply globally
})
export class ItemhistoryComponent implements AfterViewInit {
    @ViewChild('searchbox') searchBox!: ElementRef;

    items: PriceHistory[] = [];
    filteredItems: PriceHistory[] = [];
    keyword: string = "";

    constructor(private datepipe: DatePipe,
        private store: Store<{ items: string[], pricehistory: PriceHistory[] }>) {
        this.store.select('pricehistory').subscribe((pricehistory: PriceHistory[]) => {
            this.items = pricehistory.map((item: PriceHistory) => ({
                ...item,
                ExpenseDate: this.datepipe.transform(item.ExpenseDate, "yyyy-MM-dd") ?? ""
            }));
            this.filteredItems = this.items;
        });
    }
    ngAfterViewInit(): void {
        fromEvent(this.searchBox.nativeElement, 'keyup').pipe(
            map((event: any) => event.target.value.trim()), // Extract input value
            debounceTime(500), // Add a 500ms delay
            distinctUntilChanged() // Avoid duplicate searches
        ).subscribe(searchText => {
            this.searchItem(searchText);
        });
    }

    searchItem(keyword: string = "") {
        const filtered: PriceHistory[] = [];
        const query = keyword.trim();

        if (query == "") {
            this.filteredItems = this.items;
            return;
        }

        for (let i = 0; i < this.items.length; i++) {
            const item = this.items[i];
            if (item.Itemname.toLowerCase().indexOf(query.toLowerCase()) >= 0) {
                filtered.push(item);
            }
        }
        this.filteredItems = filtered;
    }

    formatCurrency(value: number) {
        return value.toLocaleString('en-US', { style: 'currency', currency: 'USD' });
    }

}
