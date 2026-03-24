import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { signIn } from 'supertokens-web-js/recipe/emailpassword';
import { AuthStore } from '../../../store/auth.store';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div>
      <h1 class="text-2xl font-bold text-gray-900 text-center">Bon retour !</h1>
      <p class="text-gray-500 text-sm text-center mt-1 mb-8">
        Connectez-vous à votre compte
      </p>

      @if (errorMessage()) {
        <div
          class="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-6"
        >
          {{ errorMessage() }}
        </div>
      }

      <form (ngSubmit)="onSubmit()">
        <div class="mb-5">
          <label
            for="email"
            class="block text-sm font-medium text-gray-700 mb-1.5"
            >Adresse email</label
          >
          <input
            id="email"
            type="email"
            [(ngModel)]="email"
            name="email"
            required
            placeholder="vous@exemple.com"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
        </div>

        <div class="mb-5">
          <div class="flex justify-between items-center mb-1.5">
            <label
              for="password"
              class="block text-sm font-medium text-gray-700"
              >Mot de passe</label
            >
            <a
              routerLink="/auth/forgot-password"
              class="text-xs text-indigo-600 hover:text-indigo-800 no-underline"
              >Oublié ?</a
            >
          </div>
          <input
            id="password"
            type="password"
            [(ngModel)]="password"
            name="password"
            required
            placeholder="Votre mot de passe"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
        </div>

        <div class="flex items-center mb-6">
          <input
            id="remember"
            type="checkbox"
            [(ngModel)]="rememberMe"
            name="remember"
            class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
          />
          <label for="remember" class="ml-2 text-sm text-gray-600"
            >Se souvenir de moi</label
          >
        </div>

        <button
          type="submit"
          [disabled]="loading()"
          class="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
        >
          {{ loading() ? 'Connexion...' : 'Se connecter' }}
        </button>
      </form>

      <p class="text-center text-sm text-gray-500 mt-6">
        Pas encore de compte ?
        <a
          routerLink="/auth/register"
          class="text-indigo-600 font-medium hover:text-indigo-800 no-underline"
          >Créer un compte</a
        >
      </p>
    </div>
  `,
})
export class LoginComponent {
  private readonly router = inject(Router);
  private readonly authStore = inject(AuthStore);

  email = '';
  password = '';
  rememberMe = false;
  loading = signal(false);
  errorMessage = signal('');

  async onSubmit() {
    this.loading.set(true);
    this.errorMessage.set('');
    try {
      const response = await signIn({
        formFields: [
          { id: 'email', value: this.email },
          { id: 'password', value: this.password },
        ],
      });
      if (response.status === 'OK') {
        this.authStore.setLoggedIn(response.user.id);
        this.router.navigate(['/home']);
      } else if (response.status === 'WRONG_CREDENTIALS_ERROR') {
        this.errorMessage.set('Email ou mot de passe incorrect.');
      } else {
        this.errorMessage.set('Erreur de connexion.');
      }
    } catch {
      this.errorMessage.set('Erreur réseau. Réessayez.');
    } finally {
      this.loading.set(false);
    }
  }
}
