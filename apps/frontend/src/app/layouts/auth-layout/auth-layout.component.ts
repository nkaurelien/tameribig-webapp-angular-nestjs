import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div
      class="min-h-screen flex flex-col items-center justify-center bg-base-200 px-4 py-12"
    >
      <a routerLink="/home" class="flex items-center gap-3 no-underline mb-8">
        <img
          src="images/tameri-logo1.png"
          alt="Tameri"
          class="w-10 h-10 rounded-full"
        />
        <span class="font-bold text-2xl">Tameri</span>
      </a>
      <div
        class="w-full max-w-md bg-base-100 rounded-2xl shadow-sm border border-base-300 p-8"
      >
        <router-outlet />
      </div>
      <p class="mt-8 text-xs text-base-content/40">
        &copy; {{ currentYear }} Tameri. Tous droits réservés.
      </p>
    </div>
  `,
})
export class AuthLayoutComponent {
  readonly currentYear = new Date().getFullYear();
}
