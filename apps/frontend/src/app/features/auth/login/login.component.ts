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
          <div class="relative">
            <input
              id="password"
              [type]="showPassword() ? 'text' : 'password'"
              [(ngModel)]="password"
              name="password"
              required
              placeholder="Votre mot de passe"
              class="w-full px-4 py-2.5 pr-10 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
            />
            <button
              type="button"
              (click)="showPassword.set(!showPassword())"
              class="absolute inset-y-0 right-0 flex items-center pr-3 text-gray-400 hover:text-gray-600"
              [attr.aria-label]="
                showPassword()
                  ? 'Masquer le mot de passe'
                  : 'Afficher le mot de passe'
              "
            >
              @if (showPassword()) {
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M13.875 18.825A10.05 10.05 0 0112 19c-4.478 0-8.268-2.943-9.543-7a9.97 9.97 0 011.563-3.029m5.858.908a3 3 0 114.243 4.243M9.878 9.878l4.242 4.242M9.88 9.88l-3.29-3.29m7.532 7.532l3.29 3.29M3 3l3.59 3.59m0 0A9.953 9.953 0 0112 5c4.478 0 8.268 2.943 9.543 7a10.025 10.025 0 01-4.132 5.411m0 0L21 21"
                  />
                </svg>
              } @else {
                <svg
                  class="w-4 h-4"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                  />
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="2"
                    d="M2.458 12C3.732 7.943 7.523 5 12 5c4.478 0 8.268 2.943 9.542 7-1.274 4.057-5.064 7-9.542 7-4.477 0-8.268-2.943-9.542-7z"
                  />
                </svg>
              }
            </button>
          </div>
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
  showPassword = signal(false);

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
