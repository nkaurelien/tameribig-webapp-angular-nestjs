import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-not-found',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div
      class="min-h-screen flex flex-col items-center justify-center text-center px-4 bg-gray-50"
    >
      <!--<img src="images/masque-afrique.jpg" alt="" class="w-40 h-auto object-contain opacity-20 mb-6" /> -->
      <span class="text-8xl font-bold text-indigo-100 mb-4">404</span>
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Page introuvable</h1>
      <p class="text-gray-500 mb-8 max-w-md">
        La page que vous recherchez n'existe pas ou a été déplacée.
      </p>
      <a
        routerLink="/home"
        class="bg-indigo-600 hover:bg-indigo-700 text-white font-medium px-6 py-2.5 rounded-lg text-sm no-underline transition-colors"
      >
        Retour à l'accueil
      </a>
    </div>
  `,
})
export class NotFoundComponent {}
