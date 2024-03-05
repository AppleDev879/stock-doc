import { Injectable } from '@angular/core';

@Injectable({
  providedIn: 'root',
})
export class UtilsService {
  // UTC milliseconds to formatted date
  static formatDate(date: number) {
    return new Date(date).toLocaleDateString('en-US');
  }

  static formatCapital(capital: number) {
    return '$' + capital.toFixed(2).replace(/\B(?=(\d{3})+(?!\d))/g, ',');
  }
}
