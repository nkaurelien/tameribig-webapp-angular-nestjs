import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="bg-gray-50 border-t border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div class="col-span-2 md:col-span-1">
            <a
              routerLink="/home"
              class="flex items-center gap-2 no-underline mb-4"
            >
              <div
                class="w-7 h-7 bg-indigo-600 rounded-lg flex items-center justify-center"
              >
                <span class="text-white font-bold text-xs">T</span>
              </div>
              <span class="text-gray-900 font-semibold">Tameri</span>
            </a>
            <p class="text-sm text-gray-500 leading-relaxed">
              Plateforme de partage de médias créatifs.
            </p>
          </div>
          <div>
            <h4
              class="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4"
            >
              Navigation
            </h4>
            <ul class="space-y-2.5 list-none p-0 m-0">
              <li>
                <a
                  routerLink="/home"
                  class="text-sm text-gray-500 hover:text-indigo-600 no-underline transition-colors"
                  >Accueil</a
                >
              </li>
              <li>
                <a
                  routerLink="/explorer"
                  class="text-sm text-gray-500 hover:text-indigo-600 no-underline transition-colors"
                  >Explorer</a
                >
              </li>
              <li>
                <a
                  routerLink="/search"
                  class="text-sm text-gray-500 hover:text-indigo-600 no-underline transition-colors"
                  >Recherche</a
                >
              </li>
              <li>
                <a
                  routerLink="/topics"
                  class="text-sm text-gray-500 hover:text-indigo-600 no-underline transition-colors"
                  >Catégories</a
                >
              </li>
            </ul>
          </div>
          <div>
            <h4
              class="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4"
            >
              Infos
            </h4>
            <ul class="space-y-2.5 list-none p-0 m-0">
              <li>
                <a
                  routerLink="/coorporate/about"
                  class="text-sm text-gray-500 hover:text-indigo-600 no-underline transition-colors"
                  >À propos</a
                >
              </li>
              <li>
                <a
                  routerLink="/coorporate/contact"
                  class="text-sm text-gray-500 hover:text-indigo-600 no-underline transition-colors"
                  >Contact</a
                >
              </li>
              <li>
                <a
                  routerLink="/coorporate/faq"
                  class="text-sm text-gray-500 hover:text-indigo-600 no-underline transition-colors"
                  >FAQ</a
                >
              </li>
            </ul>
          </div>
          <div>
            <h4
              class="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4"
            >
              Compte
            </h4>
            <ul class="space-y-2.5 list-none p-0 m-0">
              <li>
                <a
                  routerLink="/auth/login"
                  class="text-sm text-gray-500 hover:text-indigo-600 no-underline transition-colors"
                  >Connexion</a
                >
              </li>
              <li>
                <a
                  routerLink="/auth/register"
                  class="text-sm text-gray-500 hover:text-indigo-600 no-underline transition-colors"
                  >Inscription</a
                >
              </li>
            </ul>
          </div>
          <div>
            <h4
              class="text-xs font-semibold text-gray-900 uppercase tracking-wider mb-4"
            >
              Légal
            </h4>
            <ul class="space-y-2.5 list-none p-0 m-0">
              <li>
                <a
                  routerLink="/coorporate/privacy"
                  class="text-sm text-gray-500 hover:text-indigo-600 no-underline transition-colors"
                  >Confidentialité</a
                >
              </li>
              <li>
                <a
                  href="#"
                  class="text-sm text-gray-500 hover:text-indigo-600 no-underline transition-colors"
                  >CGU</a
                >
              </li>
            </ul>
          </div>
        </div>
        <div class="border-t border-gray-200 mt-10 pt-6 text-center">
          <p class="text-xs text-gray-400">
            &copy; {{ currentYear }} Tameri. Tous droits réservés.
          </p>
        </div>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  readonly currentYear = new Date().getFullYear();
}
