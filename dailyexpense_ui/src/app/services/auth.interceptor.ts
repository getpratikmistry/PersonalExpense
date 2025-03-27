import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { AuthService } from './auth.service';
import { Router } from '@angular/router';
import { inject } from '@angular/core';
import { catchError } from 'rxjs';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
    const authService = inject(AuthService);
    const router = inject(Router);
    
    const accessToken = authService.getAccessToken();
    let authReq = req;

    if (accessToken) {
        authReq = req.clone({
            setHeaders: {
                Authorization: `Bearer ${accessToken}`,
            },
        });
    }

    return next(authReq).pipe(
        catchError((error: HttpErrorResponse) => {
            if (error.status === 401) {
                return authService.handleTokenRefresh(error, () => {
                    const newAccessToken = authService.getAccessToken();
                    const clonedRequest = req.clone({
                        setHeaders: {
                            Authorization: `Bearer ${newAccessToken}`
                        }
                    });
                    return next(clonedRequest);
                });
            }
            if (error.status === 403) {
                return router.navigate(['/signin']);
            }
            
            return router.navigate(['/signin']);
        })
    );
};
