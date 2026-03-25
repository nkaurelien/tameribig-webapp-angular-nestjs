import { Component, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink, RouterLinkActive } from '@angular/router';
import { AuthStore } from '../../../store/auth.store';

@Component({
  selector: 'app-navigation',
  standalone: true,
  imports: [CommonModule, RouterLink, RouterLinkActive],
  template: `
    <header
      class="navbar sticky top-0 z-50 bg-base-100 border-b border-base-300 px-4 sm:px-6 lg:px-8"
    >
      <div class="max-w-7xl mx-auto w-full flex items-center justify-between">
        <!-- Logo + Nav links grouped left -->
        <div class="flex items-center gap-1">
          <a
            routerLink="/home"
            class="flex items-center gap-2 no-underline shrink-0 mr-4"
          >
            <img
              src="images/tameri-logo1.png"
              alt="Tameri"
              class="w-8 h-8 rounded-full"
            />
            <span class="font-semibold text-lg hidden sm:block">Tameri</span>
          </a>

          <!-- Desktop nav links -->
          <nav class="hidden md:flex items-center gap-1">
            <a
              routerLink="/home"
              routerLinkActive="!text-primary !bg-primary/10"
              [routerLinkActiveOptions]="{ exact: true }"
              class="btn btn-ghost btn-sm text-base-content/70 font-medium no-underline"
            >
              Accueil
            </a>
            <a
              routerLink="/explorer"
              routerLinkActive="!text-primary !bg-primary/10"
              class="btn btn-ghost btn-sm text-base-content/70 font-medium no-underline"
            >
              Explorer
            </a>
            <a
              routerLink="/search"
              routerLinkActive="!text-primary !bg-primary/10"
              class="btn btn-ghost btn-sm text-base-content/70 font-medium no-underline"
            >
              Recherche
            </a>
            <a
              routerLink="/topics"
              routerLinkActive="!text-primary !bg-primary/10"
              class="btn btn-ghost btn-sm text-base-content/70 font-medium no-underline"
            >
              Catégories
            </a>
          </nav>
        </div>

        <!-- Desktop actions -->
        <div class="hidden md:flex items-center gap-2">
          @if (authStore.isAuthenticated()) {
            <a
              routerLink="/console"
              routerLinkActive="!text-primary"
              class="btn btn-ghost btn-sm font-medium no-underline"
              >Mon espace</a
            >
            <a
              routerLink="/console/media"
              routerLinkActive="!text-primary"
              class="btn btn-ghost btn-sm font-medium no-underline"
              >Mes médias</a
            >
            <a
              routerLink="/auth/logout"
              class="btn btn-ghost btn-sm text-base-content/40 no-underline"
              >Déconnexion</a
            >
          } @else {
            <a
              routerLink="/auth/login"
              class="btn btn-ghost btn-sm font-medium no-underline"
              >Connexion</a
            >
            <a
              routerLink="/auth/register"
              class="btn btn-primary btn-sm no-underline"
              >S'inscrire</a
            >
          }
        </div>

        <!-- Mobile burger -->
        <button
          (click)="mobileOpen.set(!mobileOpen())"
          class="btn btn-ghost btn-square btn-sm md:hidden"
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
    </header>

    <!-- Mobile menu -->
    @if (mobileOpen()) {
      <div
        class="md:hidden border-t border-base-300 bg-base-100 sticky top-16 z-40"
      >
        <nav class="px-4 py-3 flex flex-col gap-1">
          <a
            routerLink="/home"
            (click)="mobileOpen.set(false)"
            class="btn btn-ghost btn-sm justify-start font-medium no-underline"
          >
            Accueil
          </a>
          <a
            routerLink="/explorer"
            (click)="mobileOpen.set(false)"
            class="btn btn-ghost btn-sm justify-start font-medium no-underline"
          >
            Explorer
          </a>
          <a
            routerLink="/search"
            (click)="mobileOpen.set(false)"
            class="btn btn-ghost btn-sm justify-start font-medium no-underline"
          >
            Recherche
          </a>
          <a
            routerLink="/topics"
            (click)="mobileOpen.set(false)"
            class="btn btn-ghost btn-sm justify-start font-medium no-underline"
          >
            Catégories
          </a>
          <div class="divider my-1"></div>
          @if (authStore.isAuthenticated()) {
            <a
              routerLink="/console"
              (click)="mobileOpen.set(false)"
              class="btn btn-ghost btn-sm justify-start font-medium no-underline"
            >
              Mon espace
            </a>
            <a
              routerLink="/console/media"
              (click)="mobileOpen.set(false)"
              class="btn btn-ghost btn-sm justify-start font-medium no-underline"
            >
              Mes médias
            </a>
            <a
              routerLink="/auth/logout"
              (click)="mobileOpen.set(false)"
              class="btn btn-ghost btn-sm justify-start font-medium no-underline"
            >
              Déconnexion
            </a>
          } @else {
            <a
              routerLink="/auth/login"
              (click)="mobileOpen.set(false)"
              class="btn btn-ghost btn-sm justify-start font-medium no-underline"
            >
              Connexion
            </a>
            <a
              routerLink="/auth/register"
              (click)="mobileOpen.set(false)"
              class="btn btn-primary btn-sm justify-start no-underline mt-1"
            >
              S'inscrire
            </a>
          }
        </nav>
      </div>
    }
  `,
})
export class NavigationComponent {
  readonly authStore = inject(AuthStore);
  mobileOpen = signal(false);
}
