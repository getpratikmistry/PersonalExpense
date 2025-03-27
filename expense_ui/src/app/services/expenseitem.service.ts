import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class ExpenseitemService {

    private endpoint: string = "expenseitem";

    constructor(private http: HttpClient, private configService: ConfigService) { }

    private getBaseURL(): string {
        return this.configService.get("dailyexpenseapipath") ?? "";
    }

    getitemhistory<T>() {
        const url = `${this.getBaseURL()}/${this.endpoint}/itemhistory/`;
        return this.http.get<T>(url);
    }
}
