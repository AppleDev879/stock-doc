import { Inject, Injectable } from '@angular/core';
import { MovingAvg } from './types/moving_avg';

@Injectable({
  providedIn: 'root',
})
export class MovingAverageService {
  constructor(
    @Inject('data') private data: any,
    @Inject('key') private key: string,
    @Inject('len') private len: number
  ) {}

  find(): MovingAvg[] {
    const movingAverage = (data: any, period: number) => {
      let result = [];
      for (let i = period - 1; i < data.length; i++) {
        let sum = 0;
        for (let j = 0; j < period; j++) {
          sum += data[i - j];
        }
        result[i] = sum / period;
      }
      return result;
    };

    return movingAverage(
      this.data.results.map((result: any) => result[this.key]),
      this.len
    );
  }
}
