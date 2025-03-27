import { Component, OnInit } from '@angular/core';
import { ExpenseService } from '../../services/expense.service';
import { API_STATUS, ApiResponse, Expense } from '../../models/models';
import { DatePipe } from '@angular/common';

import * as PlotlyJS from 'plotly.js-dist-min';
import { PlotlyModule } from 'angular-plotly.js';
import { forkJoin, range } from 'rxjs';

PlotlyModule.plotlyjs = PlotlyJS;

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrl: './dashboard.component.scss'
})
export class DashboardComponent implements OnInit {

    constructor(private expense_service: ExpenseService, private datepipe: DatePipe) { }

    expenseList: Expense[] = [];

    data = {
        x: [] as any,
        y: [] as any,
        type: 'lines',
        mode: 'lines+markers',
        name: "",
        marker: {
            color: 'rgb(113, 27, 163)',
            line: {
              color: 'white',
            }
          }
    }

    dataMonthly = {
        x: [] as any,
        y: [] as any,
        type: 'bar',
        name: ""
    }

    public commonLayout = {
        showlegend: false,
        font: { family: "Inter", size: 15, weight: 700 },
        height: 440,
        yaxis: {
            title: {
                text: 'Amount($)',
                font: { size: 18, weight: 700 }
            },
            tickfont: {
                weight: 600,
                size: 14,
                color: 'black'
            },
            showgrid: false
        },
        xaxis: {
            title: {
                text: '', // Placeholder, will be overridden
                font: { size: 18, weight: 700 }
            },
            tickfont: {
                weight: 600,
                size: 14,
                color: 'black'
            },
            range: ['', '']
        }
    };

    public commonConfig = { responsive: true, displaylogo: false }
    
    public graph = {
        data: [this.data],
        layout: {
            ...this.commonLayout, // Spread common properties
            title: 'Daily Expense',
            xaxis: {
                ...this.commonLayout.xaxis, // Spread xaxis settings
                title: { ...this.commonLayout.xaxis.title, text: 'Dates' } // Override title text
            }
        },
        config: this.commonConfig
    };
    
    public graph1 = {
        data: [this.dataMonthly],
        layout: {
            ...this.commonLayout, // Reuse common layout
            title: 'Monthly Expense',
            xaxis: {
                ...this.commonLayout.xaxis, // Spread xaxis settings
                title: { ...this.commonLayout.xaxis.title, text: 'Months' } // Override title text
            }
        },
        config: this.commonConfig
    };
    

    ngOnInit(): void {
        const expenseData = this.expense_service.getAll<ApiResponse<Expense[]>>();
        const dashboarddetails = this.expense_service.getDashboardDetails<ApiResponse<any>>();

        forkJoin([expenseData, dashboarddetails]).subscribe({
            next: ([result1, result2]) => {
                if(result1.status === API_STATUS.Success.toString() && result1.data) {
                    this.expenseList = result1.data.reverse();
                    this.expenseList.forEach((item: Expense) => {
                        item.ExpenseDate = this.datepipe.transform(item.ExpenseDate, "yyyy-MM-dd") ?? "";
                    });

                    const dates = this.expenseList.map(x => x.ExpenseDate);
                    const amounts = this.expenseList.map(x => {
                        return x.NetAmount
                    })
                    this.data.x = dates;
                    this.data.y = amounts;
                    this.graph.data[0] = this.data;
                    this.graph.layout.xaxis.range = [dates[0] ?? '', dates[dates.length - 1] ?? '']
                }

                if(result2.status === API_STATUS.Success.toString() && result2.data) {
                    const list = result2.data[0];
                    let months: any = [];
                    let amounts: any = [];
                    list.forEach((item: any) => {
                        months.push(item.BillMonth + "-" + item.BillYear);
                        amounts.push(item.Amount);
                    });

                    this.dataMonthly.x = months;
                    this.dataMonthly.y = amounts;
                    this.graph1.data[0] = this.dataMonthly;
                    this.graph1.layout.xaxis.range = [months[0] ?? '', months[months.length - 1] ?? '']
                }
            }
        });
    }
}
