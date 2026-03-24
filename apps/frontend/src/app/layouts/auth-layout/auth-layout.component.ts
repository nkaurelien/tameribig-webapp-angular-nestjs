import { Component } from '@angular/core';
import { RouterOutlet, RouterLink } from '@angular/router';

@Component({
  selector: 'app-auth-layout',
  standalone: true,
  imports: [RouterOutlet, RouterLink],
  template: `
    <div
      class="min-h-screen flex flex-col items-center justify-center bg-gray-50 px-4 py-12"
    >
      <a routerLink="/home" class="flex items-center gap-2 no-underline mb-8">
        <div
          class="w-10 h-10 bg-indigo-600 rounded-xl flex items-center justify-center"
        >
          <span class="text-white font-bold text-lg">T</span>
        </div>
        <span class="text-gray-900 font-bold text-2xl">Tameri</span>
      </a>
      <div
        class="w-full max-w-md bg-white rounded-2xl shadow-sm border border-gray-200 p-8"
      >
        <router-outlet />
      </div>
      <p class="mt-8 text-xs text-gray-400">
        &copy; {{ currentYear }} Tameri. Tous droits réservés.
      </p>
    </div>
  `,
})
export class AuthLayoutComponent {
  readonly currentYear = new Date().getFullYear();
}
