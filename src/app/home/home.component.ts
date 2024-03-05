import { Component } from '@angular/core';
import { ChartComponent } from '../chart/chart.component';
import { ThemeToggleComponent } from '../theme-toggle/theme-toggle.component';
import { FormsModule } from '@angular/forms';
import { StockDataService } from '../service/stock-data.service';
import { StrategyChartables } from '../service/strategy-chartables';
import { GoldenCrossService } from '../service/golden-cross-service';
import { DetailsComponent } from '../details/details.component';
import { StrategyResult } from '../service/strategy-results';
import { BuyHoldService } from '../service/buy-hold.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-home',
  standalone: true,
  template: ` <div id="container">
    <header>
      <app-theme-toggle></app-theme-toggle>

      <form>
        <input type="text" placeholder="Type to search..." #symbol />
        <input
          type="submit"
          value="Search"
          (click)="updateChart(symbol.value)"
        />
      </form>
      <h1>{{ chartedSymbol }}</h1>
    </header>
    <main>
      <div id="homeContainer">
        <div id="chartContainer">
          <app-chart
            [apiError]="apiError"
            [chartables]="chartables"
          ></app-chart>
        </div>
        <div class="details">
          <app-details
            *ngFor="let result of results"
            [result]="result"
          ></app-details>
        </div>
      </div>
    </main>
  </div>`,
  styleUrl: './home.component.css',
  imports: [
    ChartComponent,
    FormsModule,
    ThemeToggleComponent,
    DetailsComponent,
    CommonModule,
  ],
})
export class HomeComponent {
  chartedSymbol = 'MSFT';
  apiError: string | null = null;
  chartables?: StrategyChartables;
  results?: StrategyResult[];

  ngOnInit() {
    this.updateChart(this.chartedSymbol);
  }

  updateChart(symbol: string) {
    this.chartedSymbol = symbol.toUpperCase();
    StockDataService.getStockData(this.chartedSymbol)
      .then((response) => {
        if (response.status == 409) {
          this.apiError = 'Too many requests, try again in a minute';
          return;
        } else if (response.status != 200) {
          this.apiError = 'Error fetching stock data';
          return;
        } else {
          console.log('Stock data fetched');
          this.apiError = null;
        }
        return response.json();
      })
      .then((data) => {
        console.log('Charting', this.chartedSymbol);
        if (data.resultsCount == 0) {
          this.apiError = 'No stock data found';
        } else {
          const [crossResults, chartables] = new GoldenCrossService(
            data,
            'c',
            10,
            50,
            10_000
          ).find();
          this.chartables = chartables;

          const buyHoldResults = new BuyHoldService(data, 10_000).findResults();
          this.results = [crossResults, buyHoldResults];
        }
      });
  }
  constructor() {}
}
