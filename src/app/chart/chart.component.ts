import { Component, Input, SimpleChanges } from '@angular/core';
import Chart from 'chart.js/auto';
import annotationPlugin from 'chartjs-plugin-annotation';
import { StrategyChartables } from '../service/strategy-chartables';

/**
 * Represents the ChartComponent that displays a line chart.
 */
@Component({
  selector: 'app-chart',
  standalone: true,
  imports: [],
  template: ` <div class="chart-container">
    {{ apiError != null ? apiError : '' }}
    <canvas id="line-chart">{{ chart }}</canvas>
  </div>`,
  styleUrl: './chart.component.css',
})
export class ChartComponent {
  /**
   * The input data for the chart.
   */
  @Input() chartables?: StrategyChartables;

  /**
   * The error message from the API.
   */
  @Input() apiError: string | null = null;

  /**
   * The chart instance.
   */
  public chart: any = null;

  /**
   * Creates a new chart based on the provided chartables.
   * @param chartables - The data for the chart.
   */
  createChart(chartables: StrategyChartables) {
    this.destroyChartIfExists();
    this.chart = new Chart('line-chart', {
      type: 'line', // This denotes the type of chart

      data: {
        // Values on X-Axis
        labels: chartables.xLabels,
        datasets: chartables.dataSets,
      },
      options: {
        plugins: {
          annotation: {
            annotations: chartables.annotations,
          },
        },
      },
    });
  }

  /**
   * Destroys the chart if it exists.
   */
  destroyChartIfExists() {
    if (this.chart) {
      this.chart.destroy();
    }
  }

  /**
   * Initializes the chart component.
   */
  ngOnInit() {
    Chart.register(annotationPlugin);
    if (this.chartables) this.createChart(this.chartables);
  }

  /**
   * Handles changes to the input properties.
   * @param changes - The changes to the input properties.
   */
  ngOnChanges(changes: SimpleChanges) {
    if (changes['chartables'].isFirstChange() == false) {
      if (this.chartables) this.createChart(this.chartables);
    }
  }
}
