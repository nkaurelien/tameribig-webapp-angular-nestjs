import { computed } from '@angular/core';
import {
  signalStore,
  withState,
  withMethods,
  withComputed,
  patchState,
} from '@ngrx/signals';
import Session from 'supertokens-web-js/recipe/session';

interface AuthState {
  isLoggedIn: boolean;
  userId: string | null;
  loading: boolean;
}

const initialState: AuthState = {
  isLoggedIn: false,
  userId: null,
  loading: true,
};

export const AuthStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((state) => ({
    isAuthenticated: computed(() => state.isLoggedIn()),
  })),
  withMethods((store) => ({
    async checkSession() {
      patchState(store, { loading: true });
      try {
        const exists = await Session.doesSessionExist();
        if (exists) {
          const userId = await Session.getUserId();
          patchState(store, { isLoggedIn: true, userId, loading: false });
        } else {
          patchState(store, {
            isLoggedIn: false,
            userId: null,
            loading: false,
          });
        }
      } catch {
        patchState(store, { isLoggedIn: false, userId: null, loading: false });
      }
    },
    setLoggedIn(userId: string) {
      patchState(store, { isLoggedIn: true, userId, loading: false });
    },
    setLoggedOut() {
      patchState(store, { isLoggedIn: false, userId: null, loading: false });
    },
  })),
);
