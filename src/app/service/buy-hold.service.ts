import { Inject, Injectable } from '@angular/core';
import { StrategyResultsService } from './strategy-results.service';
import { StrategyChartables } from './strategy-chartables';
import { StrategyResult } from './strategy-results';
import { UtilsService } from './utils.service';

@Injectable({
  providedIn: 'root',
})
export class BuyHoldService implements StrategyResultsService {
  constructor(
    @Inject('data') public data: any,
    @Inject('capital') public captial: number
  ) {
    console.log(data);
  }
  findResults(): StrategyResult {
    const ratio =
      this.data.results[this.data.results.length - 1].c /
      this.data.results[0].c;
    const pl = UtilsService.formatCapital(this.captial * ratio - this.captial);
    const pl_pct = ((ratio - 1) * 100).toFixed(2) + '%';
    const total = UtilsService.formatCapital(this.captial * ratio);
    const capital = UtilsService.formatCapital(this.captial);
    const wins = total > capital ? 1 : 0;
    const losses = total < capital ? 1 : 0;
    const win_rate_pct = ((wins / (wins + losses)) * 100).toFixed(2) + '%';
    const avg_win_pct =
      (ratio - 1 > 0 ? (ratio - 1) * 100 : 0).toFixed(2) + '%';
    const avg_loss_pct = (ratio - 1 < 0 ? 1 - ratio * 100 : 0).toFixed(2) + '%';
    const total_trades = 2;

    return {
      symbol: this.data.ticker,
      strategy: 'Buy and Hold',
      capital: capital,
      pl: pl,
      pl_pct: pl_pct,
      total: total,
      total_wins: wins,
      total_losses: losses,
      win_rate_pct: win_rate_pct,
      avg_win_pct: avg_win_pct,
      avg_loss_pct: avg_loss_pct,
      total_trades: total_trades,
    };
  }
  findChartables(): StrategyChartables {
    throw new Error('Method not implemented.');
  }
  find(): [StrategyResult, StrategyChartables] {
    throw new Error('Method not implemented.');
  }
}
