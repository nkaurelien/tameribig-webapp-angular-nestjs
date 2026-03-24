import { Component, inject, OnInit } from '@angular/core';
import { Router } from '@angular/router';
import Session from 'supertokens-web-js/recipe/session';
import { AuthStore } from '../../../store/auth.store';

@Component({
  selector: 'app-logout',
  standalone: true,
  template: `<div class="text-center py-12 text-gray-500">Déconnexion...</div>`,
})
export class LogoutComponent implements OnInit {
  private readonly router = inject(Router);
  private readonly authStore = inject(AuthStore);

  async ngOnInit() {
    await Session.signOut();
    this.authStore.setLoggedOut();
    this.router.navigate(['/auth/login']);
  }
}
