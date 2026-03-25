import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterLink } from '@angular/router';
import { sendPasswordResetEmail } from 'supertokens-web-js/recipe/emailpassword';

@Component({
  selector: 'app-forgot-password',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <div>
      <h1 class="text-2xl font-bold text-center">Mot de passe oublié</h1>
      <p class="text-base-content/60 text-sm text-center mt-1 mb-8">
        Entrez votre email pour réinitialiser
      </p>

      @if (successMessage()) {
        <div role="alert" class="alert alert-success mb-6">
          <span>{{ successMessage() }}</span>
        </div>
      }

      @if (errorMessage()) {
        <div role="alert" class="alert alert-error mb-6">
          <span>{{ errorMessage() }}</span>
        </div>
      }

      <form (ngSubmit)="onSubmit()">
        <div class="form-control w-full mb-6">
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

        <button
          type="submit"
          [disabled]="loading()"
          class="btn btn-primary w-full"
        >
          @if (loading()) {
            <span class="loading loading-spinner loading-sm"></span>
          }
          {{ loading() ? 'Envoi...' : 'Envoyer le lien' }}
        </button>
      </form>

      <p class="text-center text-sm text-base-content/60 mt-6">
        <a routerLink="/auth/login" class="link link-primary"
          >&larr; Retour à la connexion</a
        >
      </p>
    </div>
  `,
})
export class ForgotPasswordComponent {
  email = '';
  loading = signal(false);
  errorMessage = signal('');
  successMessage = signal('');

  async onSubmit() {
    this.loading.set(true);
    this.errorMessage.set('');
    this.successMessage.set('');
    try {
      const response = await sendPasswordResetEmail({
        formFields: [{ id: 'email', value: this.email }],
      });
      if (response.status === 'OK') {
        this.successMessage.set(
          'Si un compte existe avec cet email, un lien a été envoyé.',
        );
      } else {
        this.errorMessage.set('Erreur. Réessayez.');
      }
    } catch {
      this.errorMessage.set('Erreur réseau. Réessayez.');
    } finally {
      this.loading.set(false);
    }
  }
}
