import { Component, OnInit, inject } from '@angular/core';
import { RouterOutlet, RouterLink, RouterLinkActive } from '@angular/router';
import { UserStore } from '../../store/user.store';

@Component({
  selector: 'app-console-shell',
  standalone: true,
  imports: [RouterOutlet, RouterLink, RouterLinkActive],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <div class="flex flex-col lg:flex-row gap-8">
        <!-- Sidebar -->
        <aside class="lg:w-56 shrink-0">
          <!-- User card -->
          <div class="bg-white border border-gray-200 rounded-xl p-4 mb-3">
            <div class="flex items-center gap-3">
              <div
                class="w-10 h-10 rounded-full bg-indigo-100 text-indigo-700 flex items-center justify-center text-sm font-bold shrink-0"
              >
                {{ userStore.initials() }}
              </div>
              <div class="min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">
                  {{ userStore.displayName() }}
                </p>
                <p class="text-xs text-gray-500 truncate">
                  {{ userStore.profile()?.email }}
                </p>
              </div>
            </div>
          </div>

          <!-- Nav -->
          <nav
            class="bg-white border border-gray-200 rounded-xl overflow-hidden"
          >
            <a
              routerLink="profile"
              routerLinkActive="bg-indigo-50 text-indigo-600 font-medium"
              [routerLinkActiveOptions]="{ exact: false }"
              class="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors no-underline"
            >
              <svg
                class="w-4 h-4 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z"
                />
              </svg>
              Profil
            </a>
            <a
              routerLink="media"
              routerLinkActive="bg-indigo-50 text-indigo-600 font-medium"
              [routerLinkActiveOptions]="{ exact: false }"
              class="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors no-underline border-t border-gray-100"
            >
              <svg
                class="w-4 h-4 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
              Mes médias
            </a>
            <a
              routerLink="settings"
              routerLinkActive="bg-indigo-50 text-indigo-600 font-medium"
              [routerLinkActiveOptions]="{ exact: false }"
              class="flex items-center gap-3 px-4 py-3 text-sm text-gray-700 hover:bg-gray-50 transition-colors no-underline border-t border-gray-100"
            >
              <svg
                class="w-4 h-4 shrink-0"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M10.325 4.317c.426-1.756 2.924-1.756 3.35 0a1.724 1.724 0 002.573 1.066c1.543-.94 3.31.826 2.37 2.37a1.724 1.724 0 001.065 2.572c1.756.426 1.756 2.924 0 3.35a1.724 1.724 0 00-1.066 2.573c.94 1.543-.826 3.31-2.37 2.37a1.724 1.724 0 00-2.572 1.065c-.426 1.756-2.924 1.756-3.35 0a1.724 1.724 0 00-2.573-1.066c-1.543.94-3.31-.826-2.37-2.37a1.724 1.724 0 00-1.065-2.572c-1.756-.426-1.756-2.924 0-3.35a1.724 1.724 0 001.066-2.573c-.94-1.543.826-3.31 2.37-2.37.996.608 2.296.07 2.572-1.065z"
                />
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="2"
                  d="M15 12a3 3 0 11-6 0 3 3 0 016 0z"
                />
              </svg>
              Paramètres
            </a>
          </nav>
        </aside>

        <!-- Content -->
        <main class="flex-1 min-w-0">
          <router-outlet />
        </main>
      </div>
    </div>
  `,
})
export class ConsoleShellComponent implements OnInit {
  readonly userStore = inject(UserStore);

  ngOnInit() {
    if (!this.userStore.profile()) {
      this.userStore.loadProfile();
    }
  }
}
