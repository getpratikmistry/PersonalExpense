import { Component, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import { AuthService } from '../../services/auth.service';
import { MenuItem } from 'primeng/api';

@Component({
    selector: 'app-nav-bar',
    templateUrl: './nav-bar.component.html',
    styleUrl: './nav-bar.component.scss'
})
export class NavBarComponent implements OnInit {
    isUserLoggedIn: boolean = true;

    items: MenuItem[] = [
        {
            label: 'Dashboard',
            icon: 'pi pi-fw pi-chart-scatter',
            routerLink: ['/']
        },
        {
            label: 'Expense',
            icon: 'pi pi-fw pi-table',
            routerLink: ['expenselist'],
            items: [
                {
                    label: 'List',
                    icon: 'pi pi-fw pi-list-check',
                    routerLink: ['expenselist']
                },
                {
                    label: 'New',
                    icon: 'pi pi-fw pi-plus-circle',
                    routerLink: ['newexpense/0']
                }
            ]
        },
        {
            label: 'Item History',
            icon: 'pi pi-fw pi-history',
            routerLink: ['itemhistory']
        }
    ];

    menuItems = [
        {
            label: 'User Info', icon: 'pi pi-fw pi-user'
        },
        {
            label: 'Quit', icon: 'pi pi-fw pi-sign-out', command: () => {
                this.logoff();
            }
        },
    ];

    constructor(private authService: AuthService, private router: Router) {
        this.isUserLoggedIn = this.authService.isLoggedIn();
    }

    ngOnInit(): void {

    }

    logoff() {
        this.authService.logoutUser();
        this.router.navigate(['/signin']);
    }

}
