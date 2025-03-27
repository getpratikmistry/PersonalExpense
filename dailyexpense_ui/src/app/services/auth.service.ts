import { Injectable } from '@angular/core';
import { ConfigService } from './config.service';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { BehaviorSubject, catchError, Observable, switchMap, tap, throwError } from 'rxjs';
import { LoginResponse } from '../models/models';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    private baseUrl: string = "";
    private isRefreshing = false;
    private refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);
    private isUserLoggedIn = new BehaviorSubject<boolean>(true);

    constructor(private http: HttpClient, private configService: ConfigService) { }

    private getBaseURL(): string {
        return this.configService.get("dailyexpenseapipath") ?? "";
    }

    login<T>(username: string, password: string): Observable<T> {
        return this.http.post<T>(`${this.getBaseURL()}/login`, { "Username": username, "Password": password });
    }

    checkConnection<T>(): Observable<T> {
        return this.http.get<T>(`${this.getBaseURL()}/connectioncheck`);
    }

    loginUser() {
        this.isUserLoggedIn.next(true);
    }

    logoutUser() {
        this.isUserLoggedIn.next(false);
        this.clearTokens();
    }

    isLoggedIn(): boolean {
        return this.isUserLoggedIn.value;
    }

    isAuthenticated(): boolean {
        const token = localStorage.getItem('accessToken');
        return !!token;
    }

    getToken(): string | null {
        return localStorage.getItem('accessToken');
    }

    clearToken(): void {
        localStorage.removeItem('accessToken');
    }

    storeToken(accessToken: string, refreshToken: string): void {
        localStorage.setItem('accessToken', accessToken);
        localStorage.setItem('refreshToken', refreshToken);
    }

    getAccessToken(): string | null {
        return localStorage.getItem('accessToken');
    }

    getRefreshToken(): string | null {
        return localStorage.getItem('refreshToken');
    }

    clearTokens(): void {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
    }

    refreshTheAccessToken(): Observable<any> {
        const refreshToken = this.getRefreshToken();
        if (!refreshToken) {
            return new Observable(observer => {
                observer.complete();
            });
        }

        return this.http.post(`${this.getBaseURL()}/refresh`, { refreshToken }).pipe(
            tap((response: LoginResponse) => {
                if (response && response.accessToken && response.refreshToken) {
                    this.storeToken(response.accessToken, response.refreshToken);
                    return response.accessToken;
                }
                throw new Error('No token for access or refresh available.');
            }),
            catchError(this.handleError)
        );
    }

    handleTokenRefresh(error: HttpErrorResponse, requestFn: () => Observable<any>): Observable<any> {
        if (error.status === 401 && !this.isRefreshing) {
            this.isRefreshing = true;
            this.refreshTokenSubject.next(null);

            return this.refreshTheAccessToken().pipe(
                switchMap((response: any) => {
                    this.isRefreshing = false;
                    this.refreshTokenSubject.next(response.accessToken);
                    return requestFn();
                }),
                catchError((err) => {
                    this.isRefreshing = false;
                    this.clearTokens();
                    return throwError(() => err);
                })
            );
        } else if (error.status === 401 && this.isRefreshing) {
            return this.refreshTokenSubject.pipe(
                switchMap(() => {
                    return requestFn();
                })
            );
        }
        return throwError(() => error);
    }

    private handleError(error: HttpErrorResponse): Observable<never> {
        return throwError(() => error.message || 'Server Error');
    }

    // Logout logic
    logout(): void {
        localStorage.removeItem('accessToken');
        localStorage.removeItem('refreshToken');
        this.refreshTokenSubject.next(null);
    }
}
