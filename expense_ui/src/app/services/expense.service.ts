import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Expense } from '../models/models';
import { ConfigService } from './config.service';

@Injectable({
  providedIn: 'root'
})
export class ExpenseService {
    private endpoint: string = "expense";
    constructor(private http: HttpClient, private configService: ConfigService) {
    }

    private getBaseURL(): string {
        return this.configService.get("dailyexpenseapipath") ?? "";
    }

    getAll<T>() {
        const url = `${this.getBaseURL()}/${this.endpoint}`;
        return this.http.get<T>(url);
    }

    getDashboardDetails<T>() {
        const url = `${this.getBaseURL()}/dashboarddetails/`;
        return this.http.get<T>(url);
    }

    get<T>(id: number) {
        return this.http.get<T>(`${this.getBaseURL()}/${this.endpoint}/${id}`);
    }

    getLocations<T>() {
        return this.http.get<T>(`${this.getBaseURL()}/${this.endpoint}/locations`);
    }

    create<T>(expense: Expense) {
        return this.http.post<T>(`${this.getBaseURL()}/${this.endpoint}/`, expense);
    }

    update<T>(expense: Expense) {
        return this.http.put<T>(`${this.getBaseURL()}/${this.endpoint}/`, expense);
    }

    delete<T>(id: number) {
        return this.http.delete<T>(`${this.getBaseURL()}/${this.endpoint}/${id}`);
    }
}