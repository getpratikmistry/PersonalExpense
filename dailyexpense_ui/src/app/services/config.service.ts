import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { firstValueFrom } from 'rxjs';
import { ConfigDetails } from '../models/models';

@Injectable({
    providedIn: 'root'
})
export class ConfigService {
    private config!: ConfigDetails;

    constructor(private http: HttpClient) { }

    loadConfig(): Promise<void> {
        return firstValueFrom(this.http.get<ConfigDetails>('config.json'))
            .then((data) => {
                this.config = data;
            })
            .catch((error) => {
                console.error('Could not load configuration:', error);
                return Promise.reject(error);
            });
    }

    get<K extends keyof ConfigDetails>(key: K): ConfigDetails[K] | null {
        if(!this.config) {
            this.loadConfig().then(() => {
                return this.config ? this.config[key] : null;
            });
        }
        return this.config ? this.config[key] : null;
    }
}
