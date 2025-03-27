import { Component } from '@angular/core';
import { LoginResponse, API_STATUS, ApiResponse } from '../../models/models';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-signin',
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.scss'
})
export class SigninComponent {
    username: string = "";
    password: string = "";
    
    constructor(private authService: AuthService, private router: Router) { }

    signin() {
        if (this.username == undefined || this.username == null || this.username.trim() == "") {
            alert("Check username");
            return;
        }
        if (this.password == undefined || this.password == null || this.password.trim() == "") {
            alert("Check password");
            return;
        }

        this.authService.login<ApiResponse<LoginResponse>>(this.username, this.password).subscribe({
            next: (response: ApiResponse<LoginResponse> | null) => {
                if (response && response.status === API_STATUS.Success && response.data) {
                    const data = response.data;
                    if (data.accessToken && data.refreshToken) {
                        this.authService.storeToken(data.accessToken, data.refreshToken);
                        this.authService.loginUser();
                        this.router.navigate(['/']);
                    }
                    else {
                        alert("Something went wrong at server side.");
                    }
                }
                else {
                    alert("login failed");
                }
            }
        });
    }
}
