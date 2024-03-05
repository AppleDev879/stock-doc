import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { HomeComponent } from './home/home.component';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, HomeComponent],
  template: `
    <div class="app-container">
      <main>
        <section class="content">
          <app-home></app-home>
        </section>
      </main>
      <!-- Other content of your app -->
    </div>
  `,
  styleUrl: './app.component.css',
})
export class AppComponent {
  title = 'stock-doc';
}
