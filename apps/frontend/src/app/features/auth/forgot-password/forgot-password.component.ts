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
      <h1 class="text-2xl font-bold text-gray-900 text-center">
        Mot de passe oublié
      </h1>
      <p class="text-gray-500 text-sm text-center mt-1 mb-8">
        Entrez votre email pour réinitialiser
      </p>

      @if (successMessage()) {
        <div
          class="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg mb-6"
        >
          {{ successMessage() }}
        </div>
      }

      @if (errorMessage()) {
        <div
          class="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-6"
        >
          {{ errorMessage() }}
        </div>
      }

      <form (ngSubmit)="onSubmit()">
        <div class="mb-6">
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

        <button
          type="submit"
          [disabled]="loading()"
          class="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
        >
          {{ loading() ? 'Envoi...' : 'Envoyer le lien' }}
        </button>
      </form>

      <p class="text-center text-sm text-gray-500 mt-6">
        <a
          routerLink="/auth/login"
          class="text-indigo-600 hover:text-indigo-800 no-underline"
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
