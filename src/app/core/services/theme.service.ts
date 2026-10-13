import { Injectable, signal } from '@angular/core';

type Theme = 'light' | 'dark';

/**
 * Light/dark theme. With no saved choice the site follows the system setting;
 * the toggle stores an explicit choice as data-theme on <html>.
 */
@Injectable({ providedIn: 'root' })
export class ThemeService {
  private readonly KEY = 'll_theme';
  private readonly media = window.matchMedia?.('(prefers-color-scheme: dark)');
  private readonly choice = signal<Theme | null>(this.read());
  private readonly systemDark = signal<boolean>(this.media?.matches ?? false);

  readonly isDark = () => (this.choice() ?? (this.systemDark() ? 'dark' : 'light')) === 'dark';

  constructor() {
    this.media?.addEventListener?.('change', (e) => this.systemDark.set(e.matches));
    this.apply();
  }

  toggle(): void {
    const next: Theme = this.isDark() ? 'light' : 'dark';
    this.choice.set(next);
    try { localStorage.setItem(this.KEY, next); } catch { /* storage blocked: choice lasts for this visit */ }
    this.apply();
  }

  private apply(): void {
    const choice = this.choice();
    if (choice) document.documentElement.dataset['theme'] = choice;
    else delete document.documentElement.dataset['theme'];
  }

  private read(): Theme | null {
    try {
      const v = localStorage.getItem(this.KEY);
      return v === 'light' || v === 'dark' ? v : null;
    } catch {
      return null;
    }
  }
}
