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
      <h1 class="text-2xl font-bold text-center">Bon retour !</h1>
      <p class="text-base-content/60 text-sm text-center mt-1 mb-8">
        Connectez-vous à votre compte
      </p>

      @if (errorMessage()) {
        <div role="alert" class="alert alert-error mb-6">
          <span>{{ errorMessage() }}</span>
        </div>
      }

      <form (ngSubmit)="onSubmit()">
        <div class="form-control w-full mb-5">
          <label class="label" for="email">
            <span class="label-text">Adresse email</span>
          </label>
          <input
            id="email"
            type="email"
            [(ngModel)]="email"
            name="email"
            required
            placeholder="vous@exemple.com"
            class="input input-bordered w-full"
          />
        </div>

        <div class="form-control w-full mb-5">
          <div class="flex justify-between items-center">
            <label class="label" for="password">
              <span class="label-text">Mot de passe</span>
            </label>
            <a
              routerLink="/auth/forgot-password"
              class="link link-primary text-xs"
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
              class="input input-bordered w-full pr-10"
            />
            <button
              type="button"
              (click)="showPassword.set(!showPassword())"
              class="absolute inset-y-0 right-0 flex items-center pr-3 text-base-content/40 hover:text-base-content/70"
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

        <label class="label cursor-pointer justify-start gap-3 mb-6">
          <input
            type="checkbox"
            [(ngModel)]="rememberMe"
            name="remember"
            class="checkbox checkbox-primary checkbox-sm"
          />
          <span class="label-text">Se souvenir de moi</span>
        </label>

        <button
          type="submit"
          [disabled]="loading()"
          class="btn btn-primary w-full"
        >
          @if (loading()) {
            <span class="loading loading-spinner loading-sm"></span>
          }
          {{ loading() ? 'Connexion...' : 'Se connecter' }}
        </button>
      </form>

      <p class="text-center text-sm text-base-content/60 mt-6">
        Pas encore de compte ?
        <a routerLink="/auth/register" class="link link-primary font-medium"
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
