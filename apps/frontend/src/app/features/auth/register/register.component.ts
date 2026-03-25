import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { signUp } from 'supertokens-web-js/recipe/emailpassword';
import { AuthStore } from '../../../store/auth.store';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div>
      <h1 class="text-2xl font-bold text-center">Créer un compte</h1>
      <p class="text-base-content/60 text-sm text-center mt-1 mb-8">
        Rejoignez la communauté Tameri
      </p>

      @if (errorMessage()) {
        <div role="alert" class="alert alert-error mb-6">
          <span>{{ errorMessage() }}</span>
        </div>
      }

      <form (ngSubmit)="onSubmit()">
        <div class="form-control w-full mb-5">
          <label class="label" for="fullname">
            <span class="label-text">Nom complet</span>
          </label>
          <input
            id="fullname"
            type="text"
            [(ngModel)]="fullname"
            name="fullname"
            required
            placeholder="Jean Dupont"
            class="input input-bordered w-full"
          />
        </div>

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
          <label class="label" for="password">
            <span class="label-text">Mot de passe</span>
          </label>
          <div class="relative">
            <input
              id="password"
              [type]="showPassword() ? 'text' : 'password'"
              [(ngModel)]="password"
              name="password"
              required
              placeholder="Minimum 8 caractères"
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

        <div class="form-control w-full mb-6">
          <label class="label" for="confirm">
            <span class="label-text">Confirmer</span>
          </label>
          <div class="relative">
            <input
              id="confirm"
              [type]="showConfirm() ? 'text' : 'password'"
              [(ngModel)]="confirmPassword"
              name="confirm"
              required
              placeholder="Retapez le mot de passe"
              class="input input-bordered w-full pr-10"
            />
            <button
              type="button"
              (click)="showConfirm.set(!showConfirm())"
              class="absolute inset-y-0 right-0 flex items-center pr-3 text-base-content/40 hover:text-base-content/70"
              [attr.aria-label]="
                showConfirm()
                  ? 'Masquer la confirmation'
                  : 'Afficher la confirmation'
              "
            >
              @if (showConfirm()) {
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

        <button
          type="submit"
          [disabled]="loading()"
          class="btn btn-primary w-full"
        >
          @if (loading()) {
            <span class="loading loading-spinner loading-sm"></span>
          }
          {{ loading() ? 'Inscription...' : 'Créer mon compte' }}
        </button>
      </form>

      <p class="text-center text-sm text-base-content/60 mt-6">
        Déjà un compte ?
        <a routerLink="/auth/login" class="link link-primary font-medium"
          >Se connecter</a
        >
      </p>
    </div>
  `,
})
export class RegisterComponent {
  private readonly router = inject(Router);
  private readonly authStore = inject(AuthStore);

  fullname = '';
  email = '';
  password = '';
  confirmPassword = '';
  loading = signal(false);
  errorMessage = signal('');
  showPassword = signal(false);
  showConfirm = signal(false);

  async onSubmit() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage.set('Les mots de passe ne correspondent pas.');
      return;
    }
    this.loading.set(true);
    this.errorMessage.set('');
    try {
      const response = await signUp({
        formFields: [
          { id: 'fullname', value: this.fullname },
          { id: 'email', value: this.email },
          { id: 'password', value: this.password },
        ],
      });
      if (response.status === 'OK') {
        this.authStore.setLoggedIn(response.user.id);
        this.router.navigate(['/home']);
      } else if (response.status === 'FIELD_ERROR') {
        this.errorMessage.set(
          response.formFields.map((f) => f.error).join('. '),
        );
      } else {
        this.errorMessage.set("Erreur lors de l'inscription.");
      }
    } catch {
      this.errorMessage.set('Erreur réseau. Réessayez.');
    } finally {
      this.loading.set(false);
    }
  }
}
