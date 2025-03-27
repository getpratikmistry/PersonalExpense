import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { DashboardComponent } from './components/dashboard/dashboard.component';
import { ExpenseListComponent } from './components/expense-list/expense-list.component';
import { MainComponent } from './components/main/main.component';
import { NewExpenseComponent } from './components/new-expense/new-expense.component';
import { SigninComponent } from './components/signin/signin.component';
import { authGuard } from './services/auth.guard';
import { ItemhistoryComponent } from './components/itemhistory/itemhistory.component';

const routes: Routes = [
    {
        path: 'main',
        component: MainComponent,
        canActivate: [authGuard],
        children: [
            {
                title: 'Dashboard',
                path: '',
                component: DashboardComponent,
                canActivate: [authGuard]
            },
            {
                title: 'New Expense',
                path: 'newexpense',
                component: NewExpenseComponent,
                canActivate: [authGuard]
            },
            {
                title: 'Edit Expense',
                path: 'newexpense/:id',
                component: NewExpenseComponent,
                canActivate: [authGuard]
            },
            {
                title: 'Expense List',
                path: 'expenselist',
                component: ExpenseListComponent,
                canActivate: [authGuard]
            },
            {
                title: 'Item History',
                path: 'itemhistory',
                component: ItemhistoryComponent,
                canActivate: [authGuard]
            },
            {
                path: '',
                redirectTo: '',
                pathMatch: 'full'
            }
        ]
    },
    { path: '', redirectTo: 'main', pathMatch: 'full' },
    { path: 'signin', component: SigninComponent },
    { path: '**', redirectTo: 'signin' }
];

@NgModule({
  imports: [RouterModule.forRoot(routes)],
  exports: [RouterModule]
})
export class AppRoutingModule { }
