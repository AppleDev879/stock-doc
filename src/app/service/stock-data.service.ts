import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class StockDataService {
  constructor() {}
  static async getStockData(stock: string) {
    // Formatted date 2 years before today
    const twoYearsAgo = new Date();
    twoYearsAgo.setFullYear(twoYearsAgo.getFullYear() - 2);
    const formattedTwoYearsAgo = twoYearsAgo.toISOString().split('T')[0];

    // Todays formatted date
    const today = new Date().toISOString().split('T')[0];

    return fetch(
      `https://api.polygon.io/v2/aggs/ticker/${stock}/range/1/day/${formattedTwoYearsAgo}/${today}?adjusted=true&sort=asc&limit=5000&apiKey=CPY1ab53S2aoIIkSJUi7HAzjFhbNHXYi`
    );
  }
}
