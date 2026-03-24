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
      <h1 class="text-2xl font-bold text-gray-900 text-center">
        Créer un compte
      </h1>
      <p class="text-gray-500 text-sm text-center mt-1 mb-8">
        Rejoignez la communauté Tameri
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
          <label
            for="password"
            class="block text-sm font-medium text-gray-700 mb-1.5"
            >Mot de passe</label
          >
          <input
            id="password"
            type="password"
            [(ngModel)]="password"
            name="password"
            required
            placeholder="Minimum 8 caractères"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
        </div>

        <div class="mb-6">
          <label
            for="confirm"
            class="block text-sm font-medium text-gray-700 mb-1.5"
            >Confirmer</label
          >
          <input
            id="confirm"
            type="password"
            [(ngModel)]="confirmPassword"
            name="confirm"
            required
            placeholder="Retapez le mot de passe"
            class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
          />
        </div>

        <button
          type="submit"
          [disabled]="loading()"
          class="w-full bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium py-2.5 rounded-lg text-sm transition-colors"
        >
          {{ loading() ? 'Inscription...' : 'Créer mon compte' }}
        </button>
      </form>

      <p class="text-center text-sm text-gray-500 mt-6">
        Déjà un compte ?
        <a
          routerLink="/auth/login"
          class="text-indigo-600 font-medium hover:text-indigo-800 no-underline"
          >Se connecter</a
        >
      </p>
    </div>
  `,
})
export class RegisterComponent {
  private readonly router = inject(Router);
  private readonly authStore = inject(AuthStore);

  email = '';
  password = '';
  confirmPassword = '';
  loading = signal(false);
  errorMessage = signal('');

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
