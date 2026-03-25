import { computed, inject } from '@angular/core';
import {
  signalStore,
  withState,
  withMethods,
  withComputed,
  patchState,
} from '@ngrx/signals';
import { Observable, throwError } from 'rxjs';
import { tap, catchError } from 'rxjs/operators';
import { User } from '../shared/models/user.model';
import {
  UserApiService,
  UpdateUserDto,
} from '../core/services/user-api.service';

interface UserState {
  profile: User | null;
  loading: boolean;
  saving: boolean;
  error: string | null;
}

const initialState: UserState = {
  profile: null,
  loading: false,
  saving: false,
  error: null,
};

export const UserStore = signalStore(
  { providedIn: 'root' },
  withState(initialState),
  withComputed((state) => ({
    displayName: computed(
      () =>
        state.profile()?.displayName ??
        state.profile()?.fullname ??
        state.profile()?.email ??
        '',
    ),
    initials: computed(() => {
      const p = state.profile();
      if (!p) return '?';
      const first =
        p.firstName?.[0] ?? p.displayName?.[0] ?? p.email?.[0] ?? '?';
      const last = p.lastName?.[0] ?? '';
      return (first + last).toUpperCase();
    }),
  })),
  withMethods((store, userApi = inject(UserApiService)) => ({
    loadProfile(): void {
      patchState(store, { loading: true, error: null });
      userApi.getMe().subscribe({
        next: (profile) => patchState(store, { profile, loading: false }),
        error: () =>
          patchState(store, {
            loading: false,
            error: 'Erreur de chargement du profil',
          }),
      });
    },
    saveProfile(dto: UpdateUserDto): Observable<User> {
      patchState(store, { saving: true, error: null });
      return userApi.updateMe(dto).pipe(
        tap((profile) => patchState(store, { profile, saving: false })),
        catchError((err) => {
          patchState(store, { saving: false, error: 'Erreur de sauvegarde' });
          return throwError(() => err);
        }),
      );
    },
    clearProfile(): void {
      patchState(store, initialState);
    },
  })),
);
