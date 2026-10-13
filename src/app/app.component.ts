import { Component, inject } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { ToolbarComponent } from './layout/toolbar.component';
import { ThemeService } from './core/services/theme.service';

@Component({
  selector: 'll-root',
  standalone: true,
  imports: [RouterOutlet, ToolbarComponent],
  templateUrl: './app.component.html',
})
export class AppComponent {
  // Instantiating the theme service applies the saved or system theme on startup.
  private theme = inject(ThemeService);
}
