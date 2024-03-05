import { StrategyChartables } from './strategy-chartables';
import { StrategyResult } from './strategy-results';

export interface StrategyResultsService {
  findResults(): StrategyResult;
  findChartables(): StrategyChartables;
  find(): [StrategyResult, StrategyChartables];
}
