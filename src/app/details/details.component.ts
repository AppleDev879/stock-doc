import { Component, Input } from '@angular/core';
import { StrategyResult } from '../service/strategy-results';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './details.component.html',
  styleUrl: './details.component.css',
})
export class DetailsComponent {
  @Input() result?: StrategyResult;
}
