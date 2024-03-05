export interface StrategyResult {
  symbol: string;
  strategy: string;
  capital: string;
  pl: string;
  pl_pct: string;
  total: string;
  total_wins: number;
  total_losses: number;
  win_rate_pct: string;
  avg_win_pct: string;
  avg_loss_pct: string;
  // avg_win_loss_ratio: number;
  total_trades: number;
}
