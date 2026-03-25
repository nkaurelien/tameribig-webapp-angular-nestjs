import { Routes } from '@angular/router';
import { ConsoleShellComponent } from './console-shell.component';
import { ProfileComponent } from './profile/profile.component';
import { MediaListComponent } from './media/media-list.component';
import { MediaUploadComponent } from './media/media-upload.component';
import { MediaEditComponent } from './media/media-edit.component';
import { SettingsComponent } from './settings/settings.component';

export const CONSOLE_ROUTES: Routes = [
  {
    path: '',
    component: ConsoleShellComponent,
    children: [
      { path: '', redirectTo: 'profile', pathMatch: 'full' },
      { path: 'profile', component: ProfileComponent },
      { path: 'media', component: MediaListComponent },
      { path: 'media/upload', component: MediaUploadComponent },
      { path: 'media/:id/edit', component: MediaEditComponent },
      { path: 'settings', component: SettingsComponent },
    ],
  },
];
