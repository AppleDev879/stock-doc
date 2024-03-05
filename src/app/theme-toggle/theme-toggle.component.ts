import { Component } from '@angular/core';
import { ThemeService } from '../service/theme.service';
import { Inject } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { Chart } from 'chart.js';

@Component({
  selector: 'app-theme-toggle',
  standalone: true,
  templateUrl: './theme-toggle.component.html',
  styleUrls: ['./theme-toggle.component.css'],
  imports: [MatIconModule],
})
export class ThemeToggleComponent {
  isDarkMode: boolean;

  constructor(@Inject(ThemeService) private themeService: ThemeService) {
    this.isDarkMode = this.themeService.isDarkMode();
  }

  toggleTheme() {
    this.isDarkMode = !this.isDarkMode;
    this.themeService.setDarkMode(this.isDarkMode);

    const lightColor = '#E5E5E5';
    const darkColor = 'white';

    for (const id in Chart.instances) {
      const chart = Chart.instances[id];

      if (this.isDarkMode) {
        chart.options.scales!['x']!.grid!.color = darkColor;
        chart.options.scales!['y']!.grid!.color = darkColor;
        chart.options.scales!['x']!.ticks!.color! = darkColor;
        chart.options.scales!['y']!.ticks!.color! = darkColor;
      } else {
        chart.options.scales!['x']!.grid!.color = lightColor;
        chart.options.scales!['y']!.grid!.color = lightColor;
        chart.options.scales!['x']!.ticks!.color! = lightColor;
        chart.options.scales!['y']!.ticks!.color! = lightColor;
      }

      // Update the chart to apply the new options
      chart.update();
    }
  }
}
