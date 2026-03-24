import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthStore } from '../../../store/auth.store';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header class="sticky top-0 z-50 w-full bg-white border-b border-gray-200">
      <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div class="flex items-center justify-between h-16">
          <!-- Logo -->
          <a
            routerLink="/home"
            class="flex items-center gap-2 no-underline shrink-0"
          >
            <img
              src="images/tameri-logo1.png"
              alt="Tameri"
              class="w-8 h-8 rounded-full"
            />
            <span class="text-gray-900 font-semibold text-lg hidden sm:block"
              >Tameri</span
            >
          </a>

          <!-- Desktop nav links -->
          <nav class="hidden md:flex items-center gap-1">
            <a
              routerLink="/home"
              routerLinkActive="!text-indigo-600 !bg-indigo-50"
              [routerLinkActiveOptions]="{ exact: true }"
              class="text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors no-underline"
            >
              Accueil
            </a>
            <a
              routerLink="/explorer"
              routerLinkActive="!text-indigo-600 !bg-indigo-50"
              class="text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors no-underline"
            >
              Explorer
            </a>
            <a
              routerLink="/search"
              routerLinkActive="!text-indigo-600 !bg-indigo-50"
              class="text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors no-underline"
            >
              Recherche
            </a>
            <a
              routerLink="/topics"
              routerLinkActive="!text-indigo-600 !bg-indigo-50"
              class="text-gray-600 hover:text-gray-900 hover:bg-gray-50 px-3 py-2 rounded-lg text-sm font-medium transition-colors no-underline"
            >
              Catégories
            </a>
          </nav>

          <!-- Desktop actions -->
          <div class="hidden md:flex items-center gap-3">
            @if (authStore.isAuthenticated()) {
              <a
                routerLink="/console"
                class="text-gray-600 hover:text-gray-900 text-sm font-medium no-underline transition-colors"
                >Mon espace</a
              >
              <a
                routerLink="/auth/logout"
                class="text-gray-400 hover:text-gray-600 text-sm no-underline transition-colors"
                >Déconnexion</a
              >
            } @else {
              <a
                routerLink="/auth/login"
                class="text-gray-600 hover:text-gray-900 text-sm font-medium no-underline transition-colors"
                >Connexion</a
              >
              <a
                routerLink="/auth/register"
                class="bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-4 py-2 rounded-lg no-underline transition-colors"
                >S'inscrire</a
              >
            }
          </div>

          <!-- Mobile burger -->
          <button
            (click)="mobileOpen.set(!mobileOpen())"
            class="md:hidden p-2 rounded-lg text-gray-500 hover:bg-gray-100 transition-colors"
          >
            <svg
              class="w-6 h-6"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
            >
              @if (mobileOpen()) {
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M6 18L18 6M6 6l12 12"
                />
              } @else {
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 6h16M4 12h16M4 18h16"
                />
              }
            </svg>
          </button>
        </div>
      </div>

      <!-- Mobile menu -->
      @if (mobileOpen()) {
        <div class="md:hidden border-t border-gray-200 bg-white">
          <nav class="px-4 py-3 flex flex-col gap-1">
            <a
              routerLink="/home"
              (click)="mobileOpen.set(false)"
              class="text-gray-700 hover:bg-gray-50 px-3 py-2.5 rounded-lg text-sm font-medium no-underline transition-colors"
            >
              Accueil
            </a>
            <a
              routerLink="/explorer"
              (click)="mobileOpen.set(false)"
              class="text-gray-700 hover:bg-gray-50 px-3 py-2.5 rounded-lg text-sm font-medium no-underline transition-colors"
            >
              Explorer
            </a>
            <a
              routerLink="/search"
              (click)="mobileOpen.set(false)"
              class="text-gray-700 hover:bg-gray-50 px-3 py-2.5 rounded-lg text-sm font-medium no-underline transition-colors"
            >
              Recherche
            </a>
            <a
              routerLink="/topics"
              (click)="mobileOpen.set(false)"
              class="text-gray-700 hover:bg-gray-50 px-3 py-2.5 rounded-lg text-sm font-medium no-underline transition-colors"
            >
              Catégories
            </a>
            <div class="border-t border-gray-100 my-2"></div>
            @if (authStore.isAuthenticated()) {
              <a
                routerLink="/console"
                (click)="mobileOpen.set(false)"
                class="text-gray-700 hover:bg-gray-50 px-3 py-2.5 rounded-lg text-sm font-medium no-underline transition-colors"
              >
                Mon espace
              </a>
              <a
                routerLink="/auth/logout"
                (click)="mobileOpen.set(false)"
                class="text-gray-700 hover:bg-gray-50 px-3 py-2.5 rounded-lg text-sm font-medium no-underline transition-colors"
              >
                Déconnexion
              </a>
            } @else {
              <a
                routerLink="/auth/login"
                (click)="mobileOpen.set(false)"
                class="text-gray-700 hover:bg-gray-50 px-3 py-2.5 rounded-lg text-sm font-medium no-underline transition-colors"
              >
                Connexion
              </a>
              <a
                routerLink="/auth/register"
                (click)="mobileOpen.set(false)"
                class="bg-indigo-600 hover:bg-indigo-700 text-white text-center px-3 py-2.5 rounded-lg text-sm font-medium no-underline transition-colors mt-1"
              >
                S'inscrire
              </a>
            }
          </nav>
        </div>
      }
    </header>
  `,
})
export class NavigationComponent {
  readonly authStore = inject(AuthStore);
  mobileOpen = signal(false);
}
