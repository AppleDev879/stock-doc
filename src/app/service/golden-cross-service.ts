import { Inject, Injectable } from '@angular/core';
import { StrategyResultsService } from './strategy-results.service';
import { StrategyResult } from './strategy-results';
import { StrategyChartables } from './strategy-chartables';
import { MovingAverageService } from './moving-average.service';
import { MovingAvg } from './types/moving_avg';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class GoldenCrossService implements StrategyResultsService {
  shortMA: MovingAvg[] = [];
  longMA: MovingAvg[] = [];
  goldenCrosses: number[][] = [];
  deathCrosses: number[][] = [];
  constructor(
    @Inject('data') public data: any,
    @Inject('dataKey') public dataKey: string,
    @Inject('shortMALen') public shortMALen: number,
    @Inject('longMALen') public longMALen: number,
    @Inject('capital') public capital: number
  ) {
    let mvAvgSrvc = new MovingAverageService(
      this.data,
      this.dataKey,
      this.shortMALen
    );
    this.shortMA = mvAvgSrvc.find();
    mvAvgSrvc = new MovingAverageService(
      this.data,
      this.dataKey,
      this.longMALen
    );
    this.longMA = mvAvgSrvc.find();
    this.goldenCrosses = this.findGoldenCrosses();
    this.deathCrosses = this.findDeathCrosses();
  }
  find(): [StrategyResult, StrategyChartables] {
    return [this.findResults(), this.findChartables()];
  }

  findChartables(): StrategyChartables {
    const annotations: { [key: string]: any } = this.findFalsePositives(
      this.goldenCrosses,
      this.deathCrosses
    );

    for (let i = 0; i < this.goldenCrosses.length; i++) {
      annotations['golden' + i] = {
        type: 'point',
        xValue: this.goldenCrosses[i][0],
        yValue: this.goldenCrosses[i][1],
        backgroundColor: 'rgba(0, 255, 0, 0.25)',
      };
    }

    for (let i = 0; i < this.deathCrosses.length; i++) {
      annotations['death' + i] = {
        type: 'point',
        xValue: this.deathCrosses[i][0],
        yValue: this.deathCrosses[i][1],
        backgroundColor: 'rgba(255, 0, 0, 0.25)',
      };
    }

    return {
      xLabels: this.data.results.map((result: { t: number }) =>
        UtilsService.formatDate(result.t)
      ),
      annotations: annotations,
      dataSets: [
        {
          label: 'Price',
          data: this.data.results.map((result: any) => result[this.dataKey]),
          backgroundColor: 'green',
        },
        {
          label: `${this.shortMALen}-Day MA`,
          data: this.shortMA,
          backgroundColor: 'orange',
        },
        {
          label: `${this.longMALen}-Day MA`,
          data: this.longMA,
          backgroundColor: 'blue',
        },
      ],
    };
  }
  findResults(): StrategyResult {
    const capital = this.capital;
    let total = capital;
    let wins = 0;
    let losses = 0;
    let winRatioSum = 0;
    let lossRatioSum = 0;

    for (const golden of this.goldenCrosses) {
      const death = this.deathCrosses.find((death) => death[0] > golden[0]);
      let ratio = 0;
      if (death) {
        ratio =
          this.data.results[death[0]][this.dataKey] /
          this.data.results[golden[0]][this.dataKey];
      } else {
        ratio =
          this.data.results[this.data.results.length - 1][this.dataKey] /
          this.data.results[golden[0]][this.dataKey];
      }
      if (ratio > 1) {
        wins++;
        winRatioSum += ratio - 1;
      } else {
        losses++;
        lossRatioSum += 1 - ratio;
      }
      total *= ratio;
    }

    return {
      symbol: this.data.ticker,
      strategy: 'Golden Cross',
      capital: UtilsService.formatCapital(capital),
      pl: UtilsService.formatCapital(total - capital),
      pl_pct: (((total - capital) / capital) * 100).toFixed(2) + '%',
      total: total.toFixed(2),
      total_wins: wins,
      total_losses: losses,
      win_rate_pct: ((wins / (wins + losses)) * 100).toFixed(2) + '%',
      avg_win_pct: ((winRatioSum / wins) * 100).toFixed(2) + '%',
      avg_loss_pct: '(' + ((lossRatioSum / losses) * 100).toFixed(2) + ')%',
      total_trades: this.goldenCrosses.length + this.deathCrosses.length,
    };
  }

  findGoldenCrosses() {
    const goldenCrosses: number[][] = [];
    for (
      let i = Math.max(this.shortMALen, this.longMALen);
      i < this.shortMA.length;
      i++
    ) {
      if (
        this.shortMA[i] !== undefined &&
        this.shortMA[i]! > this.longMA[i]! &&
        this.shortMA[i - 1]! < this.longMA[i - 1]!
      ) {
        goldenCrosses.push([i, this.longMA[i]!]);
      }
    }

    return goldenCrosses;
  }

  findDeathCrosses() {
    const deathCrosses: number[][] = [];
    for (
      let i = Math.max(this.shortMALen, this.longMALen);
      i < this.shortMA.length;
      i++
    ) {
      if (
        this.shortMA[i]! < this.longMA[i]! &&
        this.shortMA[i - 1]! > this.longMA[i - 1]!
      ) {
        deathCrosses.push([i, this.longMA[i]!]);
      }
    }
    return deathCrosses;
  }

  findFalsePositives(
    goldenCrosses: number[][],
    deathCrosses: number[][]
  ): { [key: string]: any } {
    const annotations: { [key: string]: any } = {}; // Add index signature to annotations object
    for (const golden of goldenCrosses) {
      const death = deathCrosses.find((death) => death[0] > golden[0]);
      if (death && death[1] < golden[1]) {
        annotations['false' + golden[0]] = {
          type: 'point',
          pointStyle: 'crossRot',
          xValue: golden[0],
          yValue: golden[1],
          backgroundColor: 'rgba(0, 0, 0, 1)',
          borderColor: 'rgba(0, 0, 0, 1)',
        };
      }
    }
    return annotations;
  }
}
