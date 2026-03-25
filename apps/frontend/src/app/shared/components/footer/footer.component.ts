import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-footer',
  standalone: true,
  imports: [RouterLink],
  template: `
    <footer class="bg-base-200 border-t border-base-300">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
        <div class="grid grid-cols-2 md:grid-cols-5 gap-8">
          <div class="col-span-2 md:col-span-1">
            <a
              routerLink="/home"
              class="flex items-center gap-2 no-underline mb-4"
            >
              <img
                src="images/tameri-logo1.png"
                alt="Tameri"
                class="w-7 h-7 rounded-full"
              />
              <span class="font-semibold">Tameri</span>
            </a>
            <p class="text-sm text-base-content/50 leading-relaxed">
              Plateforme de partage de médias créatifs.
            </p>
          </div>
          <div>
            <h4 class="footer-title text-xs uppercase tracking-wider">
              Navigation
            </h4>
            <ul class="space-y-2.5 list-none p-0 m-0">
              <li>
                <a
                  routerLink="/home"
                  class="link link-hover text-sm no-underline"
                  >Accueil</a
                >
              </li>
              <li>
                <a
                  routerLink="/explorer"
                  class="link link-hover text-sm no-underline"
                  >Explorer</a
                >
              </li>
              <li>
                <a
                  routerLink="/search"
                  class="link link-hover text-sm no-underline"
                  >Recherche</a
                >
              </li>
              <li>
                <a
                  routerLink="/topics"
                  class="link link-hover text-sm no-underline"
                  >Catégories</a
                >
              </li>
            </ul>
          </div>
          <div>
            <h4 class="footer-title text-xs uppercase tracking-wider">Infos</h4>
            <ul class="space-y-2.5 list-none p-0 m-0">
              <li>
                <a
                  routerLink="/info/about"
                  class="link link-hover text-sm no-underline"
                  >À propos</a
                >
              </li>
              <li>
                <a
                  routerLink="/info/contact"
                  class="link link-hover text-sm no-underline"
                  >Contact</a
                >
              </li>
              <li>
                <a
                  routerLink="/info/faq"
                  class="link link-hover text-sm no-underline"
                  >FAQ</a
                >
              </li>
            </ul>
          </div>
          <div>
            <h4 class="footer-title text-xs uppercase tracking-wider">
              Compte
            </h4>
            <ul class="space-y-2.5 list-none p-0 m-0">
              <li>
                <a
                  routerLink="/auth/login"
                  class="link link-hover text-sm no-underline"
                  >Connexion</a
                >
              </li>
              <li>
                <a
                  routerLink="/auth/register"
                  class="link link-hover text-sm no-underline"
                  >Inscription</a
                >
              </li>
            </ul>
          </div>
          <div>
            <h4 class="footer-title text-xs uppercase tracking-wider">Légal</h4>
            <ul class="space-y-2.5 list-none p-0 m-0">
              <li>
                <a
                  routerLink="/info/privacy"
                  class="link link-hover text-sm no-underline"
                  >Confidentialité</a
                >
              </li>
              <li>
                <a
                  routerLink="/info/terms"
                  class="link link-hover text-sm no-underline"
                  >CGU</a
                >
              </li>
            </ul>
          </div>
        </div>
        <div class="divider"></div>
        <p class="text-xs text-base-content/40 text-center">
          &copy; {{ currentYear }} Tameri. Tous droits réservés.
        </p>
      </div>
    </footer>
  `,
})
export class FooterComponent {
  readonly currentYear = new Date().getFullYear();
}
