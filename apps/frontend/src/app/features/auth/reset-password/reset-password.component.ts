import { Component, OnInit, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { submitNewPassword } from 'supertokens-web-js/recipe/emailpassword';

@Component({
  selector: 'app-reset-password',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div>
      <h1 class="text-2xl font-bold text-center">Nouveau mot de passe</h1>
      <p class="text-base-content/60 text-sm text-center mt-1 mb-8">
        Choisissez un nouveau mot de passe
      </p>

      @if (successMessage()) {
        <div role="alert" class="alert alert-success mb-6">
          <span>{{ successMessage() }}</span>
        </div>
        <div class="text-center mt-4">
          <a routerLink="/auth/login" class="btn btn-primary"> Se connecter </a>
        </div>
      } @else {
        @if (errorMessage()) {
          <div role="alert" class="alert alert-error mb-6">
            <span>{{ errorMessage() }}</span>
          </div>
        }

        @if (!token()) {
          <div role="alert" class="alert alert-warning mb-6">
            <span>Lien de réinitialisation invalide ou expiré.</span>
          </div>
          <div class="text-center">
            <a routerLink="/auth/forgot-password" class="link link-primary">
              Demander un nouveau lien
            </a>
          </div>
        } @else {
          <form (ngSubmit)="onSubmit()">
            <div class="form-control w-full mb-5">
              <label class="label" for="password">
                <span class="label-text">Nouveau mot de passe</span>
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
                <span class="label-text">Confirmer le mot de passe</span>
              </label>
              <input
                id="confirm"
                [type]="showPassword() ? 'text' : 'password'"
                [(ngModel)]="confirmPassword"
                name="confirm"
                required
                placeholder="Retapez le mot de passe"
                class="input input-bordered w-full"
              />
            </div>

            <button
              type="submit"
              [disabled]="loading()"
              class="btn btn-primary w-full"
            >
              @if (loading()) {
                <span class="loading loading-spinner loading-sm"></span>
              }
              {{ loading() ? 'Modification...' : 'Modifier le mot de passe' }}
            </button>
          </form>

          <p class="text-center text-sm text-base-content/60 mt-6">
            <a routerLink="/auth/login" class="link link-primary">
              &larr; Retour à la connexion
            </a>
          </p>
        }
      }
    </div>
  `,
})
export class ResetPasswordComponent implements OnInit {
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  token = signal<string | null>(null);
  password = '';
  confirmPassword = '';
  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');
  showPassword = signal(false);

  ngOnInit() {
    this.token.set(this.route.snapshot.queryParamMap.get('token'));
  }

  async onSubmit() {
    if (this.password !== this.confirmPassword) {
      this.errorMessage.set('Les mots de passe ne correspondent pas.');
      return;
    }
    if (this.password.length < 8) {
      this.errorMessage.set(
        'Le mot de passe doit contenir au moins 8 caractères.',
      );
      return;
    }

    this.loading.set(true);
    this.errorMessage.set('');

    try {
      const response = await submitNewPassword({
        formFields: [{ id: 'password', value: this.password }],
      });
      if (response.status === 'OK') {
        this.successMessage.set(
          'Mot de passe modifié avec succès. Vous pouvez maintenant vous connecter.',
        );
      } else if (response.status === 'RESET_PASSWORD_INVALID_TOKEN_ERROR') {
        this.errorMessage.set(
          'Le lien de réinitialisation est invalide ou a expiré. Veuillez en demander un nouveau.',
        );
      } else if (response.status === 'FIELD_ERROR') {
        this.errorMessage.set(
          response.formFields.map((f) => f.error).join('. '),
        );
      } else {
        this.errorMessage.set('Erreur lors de la modification.');
      }
    } catch {
      this.errorMessage.set('Erreur réseau. Réessayez.');
    } finally {
      this.loading.set(false);
    }
  }
}
