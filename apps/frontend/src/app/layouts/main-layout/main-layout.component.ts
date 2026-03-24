import { Component } from '@angular/core';
import { RouterOutlet } from '@angular/router';
import { NavigationComponent } from '../../shared/components/navigation/navigation.component';
import { FooterComponent } from '../../shared/components/footer/footer.component';
import { ScrollTopComponent } from '../../shared/components/scroll-top/scroll-top.component';

@Component({
  selector: 'app-main-layout',
  standalone: true,
  imports: [
    RouterOutlet,
    NavigationComponent,
    FooterComponent,
    ScrollTopComponent,
  ],
  template: `
    <div class="min-h-screen flex flex-col bg-white">
      <app-navigation />
      <main class="flex-1">
        <router-outlet />
      </main>
      <app-footer />
      <app-scroll-top />
    </div>
  `,
})
export class MainLayoutComponent {}
