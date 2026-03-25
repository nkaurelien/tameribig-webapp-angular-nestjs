import { Component, inject, OnInit, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import Session from 'supertokens-web-js/recipe/session';
import { AuthStore } from '../../../store/auth.store';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="text-center">
      <h1 class="text-2xl font-bold text-gray-900 mb-2">Déconnexion</h1>

      @if (error()) {
        <p class="text-gray-500 text-sm mb-8">Une erreur est survenue.</p>
        <div
          class="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-6"
        >
          {{ error() }}
        </div>
        <a
          routerLink="/home"
          class="text-indigo-600 font-medium hover:text-indigo-800 no-underline text-sm"
          >Retour à l'accueil</a
        >
      } @else {
        <p class="text-gray-500 text-sm mb-8">
          Déconnexion en cours, veuillez patienter...
        </p>
        <div class="flex justify-center" role="status" aria-label="Chargement">
          <div
            class="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"
          ></div>
        </div>
      }
    </div>
  `,
})
export class LogoutComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authStore = inject(AuthStore);

  readonly error = signal('');

  async ngOnInit() {
    try {
      await Session.signOut();
      this.authStore.setLoggedOut();
      this.router.navigate(['/auth/login']);
    } catch {
      this.error.set('Impossible de se déconnecter. Réessayez.');
    }
  }
}
