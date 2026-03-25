import { Component, OnInit, inject, signal, effect } from '@angular/core';
import { ReactiveFormsModule, FormGroup, FormControl } from '@angular/forms';
import { UserStore } from '../../../store/user.store';
import { UpdateUserDto } from '../../../core/services/user-api.service';
import { User } from '../../../shared/models/user.model';

@Component({
  selector: 'app-console-profile',
  standalone: true,
  imports: [ReactiveFormsModule],
  template: `
    <div>
      <div class="mb-6">
        <h1 class="text-xl font-bold text-gray-900">Mon profil</h1>
        <p class="text-sm text-gray-500 mt-1">
          Informations visibles sur votre espace public
        </p>
      </div>

      @if (successMessage()) {
        <div
          class="bg-green-50 border border-green-200 text-green-700 text-sm px-4 py-3 rounded-lg mb-6"
        >
          {{ successMessage() }}
        </div>
      }
      @if (errorMessage()) {
        <div
          class="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-6"
        >
          {{ errorMessage() }}
        </div>
      }

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
        <!-- Informations personnelles -->
        <div class="bg-white border border-gray-200 rounded-xl p-6">
          <h2 class="text-base font-semibold text-gray-900 mb-4">
            Informations personnelles
          </h2>
          <div
            formGroupName="personal"
            class="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5"
                >Prénom</label
              >
              <input
                formControlName="firstName"
                type="text"
                placeholder="Jean"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5"
                >Nom</label
              >
              <input
                formControlName="lastName"
                type="text"
                placeholder="Dupont"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1.5"
                >Nom d'affichage</label
              >
              <input
                formControlName="displayName"
                type="text"
                placeholder="Jean Dupont"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5"
                >Téléphone</label
              >
              <input
                formControlName="phoneNumber"
                type="tel"
                placeholder="+237 6XX XXX XXX"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5"
                >Profession</label
              >
              <input
                formControlName="occupation"
                type="text"
                placeholder="Photographe"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1.5"
                >Entreprise</label
              >
              <input
                formControlName="companyName"
                type="text"
                placeholder="Acme Corp"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1.5"
                >À propos</label
              >
              <textarea
                formControlName="about"
                rows="3"
                placeholder="Décrivez-vous en quelques mots..."
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
              ></textarea>
            </div>
          </div>
        </div>

        <!-- Adresse -->
        <div class="bg-white border border-gray-200 rounded-xl p-6">
          <h2 class="text-base font-semibold text-gray-900 mb-4">Adresse</h2>
          <div
            formGroupName="address"
            class="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            <div class="sm:col-span-2">
              <label class="block text-sm font-medium text-gray-700 mb-1.5"
                >Rue</label
              >
              <input
                formControlName="street"
                type="text"
                placeholder="123 rue de la Paix"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5"
                >Ville</label
              >
              <input
                formControlName="city"
                type="text"
                placeholder="Douala"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5"
                >Région</label
              >
              <input
                formControlName="region"
                type="text"
                placeholder="Littoral"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5"
                >Pays</label
              >
              <input
                formControlName="country"
                type="text"
                placeholder="Cameroun"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5"
                >Code postal</label
              >
              <input
                formControlName="postalCode"
                type="text"
                placeholder="00237"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
            </div>
          </div>
        </div>

        <!-- Réseaux sociaux -->
        <div class="bg-white border border-gray-200 rounded-xl p-6">
          <h2 class="text-base font-semibold text-gray-900 mb-4">
            Réseaux sociaux
          </h2>
          <div
            formGroupName="socialLinks"
            class="grid grid-cols-1 sm:grid-cols-2 gap-4"
          >
            @for (network of socialNetworks; track network.key) {
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5">{{
                  network.label
                }}</label>
                <input
                  [formControlName]="network.key"
                  type="url"
                  [placeholder]="network.placeholder"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
            }
          </div>
        </div>

        <!-- Submit -->
        <div class="flex justify-end">
          <button
            type="submit"
            [disabled]="userStore.saving()"
            class="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-colors"
          >
            {{
              userStore.saving()
                ? 'Enregistrement...'
                : 'Enregistrer les modifications'
            }}
          </button>
        </div>
      </form>
    </div>
  `,
})
export class ProfileComponent implements OnInit {
  readonly userStore = inject(UserStore);

  successMessage = signal('');
  errorMessage = signal('');

  readonly socialNetworks = [
    {
      key: 'linkedin',
      label: 'LinkedIn',
      placeholder: 'https://linkedin.com/in/...',
    },
    {
      key: 'twitter',
      label: 'Twitter / X',
      placeholder: 'https://twitter.com/...',
    },
    {
      key: 'facebook',
      label: 'Facebook',
      placeholder: 'https://facebook.com/...',
    },
    {
      key: 'instagram',
      label: 'Instagram',
      placeholder: 'https://instagram.com/...',
    },
    {
      key: 'youtube',
      label: 'YouTube',
      placeholder: 'https://youtube.com/...',
    },
    {
      key: 'dribbble',
      label: 'Dribbble',
      placeholder: 'https://dribbble.com/...',
    },
  ];

  form = new FormGroup({
    personal: new FormGroup({
      firstName: new FormControl('', { nonNullable: true }),
      lastName: new FormControl('', { nonNullable: true }),
      displayName: new FormControl('', { nonNullable: true }),
      phoneNumber: new FormControl('', { nonNullable: true }),
      occupation: new FormControl('', { nonNullable: true }),
      companyName: new FormControl('', { nonNullable: true }),
      about: new FormControl('', { nonNullable: true }),
    }),
    address: new FormGroup({
      street: new FormControl('', { nonNullable: true }),
      locality: new FormControl('', { nonNullable: true }),
      city: new FormControl('', { nonNullable: true }),
      region: new FormControl('', { nonNullable: true }),
      country: new FormControl('', { nonNullable: true }),
      postalCode: new FormControl('', { nonNullable: true }),
    }),
    socialLinks: new FormGroup({
      facebook: new FormControl('', { nonNullable: true }),
      youtube: new FormControl('', { nonNullable: true }),
      twitter: new FormControl('', { nonNullable: true }),
      instagram: new FormControl('', { nonNullable: true }),
      linkedin: new FormControl('', { nonNullable: true }),
      dribbble: new FormControl('', { nonNullable: true }),
    }),
  });

  constructor() {
    effect(() => {
      const profile = this.userStore.profile();
      if (profile) this.patchFormFromProfile(profile);
    });
  }

  ngOnInit() {
    const profile = this.userStore.profile();
    if (profile) this.patchFormFromProfile(profile);
  }

  private patchFormFromProfile(profile: User): void {
    this.form.patchValue({
      personal: {
        firstName: profile.firstName ?? '',
        lastName: profile.lastName ?? '',
        displayName: profile.displayName ?? '',
        phoneNumber: profile.phoneNumber ?? '',
        occupation: profile.occupation ?? '',
        companyName: profile.companyName ?? '',
        about: profile.about ?? '',
      },
      address: {
        street: profile.address?.street ?? '',
        locality: profile.address?.locality ?? '',
        city: profile.address?.city ?? '',
        region: profile.address?.region ?? '',
        country: profile.address?.country ?? '',
        postalCode: profile.address?.postalCode ?? '',
      },
      socialLinks: {
        facebook: profile.socialLinks?.facebook ?? '',
        youtube: profile.socialLinks?.youtube ?? '',
        twitter: profile.socialLinks?.twitter ?? '',
        instagram: profile.socialLinks?.instagram ?? '',
        linkedin: profile.socialLinks?.linkedin ?? '',
        dribbble: profile.socialLinks?.dribbble ?? '',
      },
    });
  }

  onSubmit(): void {
    if (this.form.invalid) return;
    const { personal, address, socialLinks } = this.form.value;
    const dto: UpdateUserDto = {
      ...personal,
      address: address ?? undefined,
      socialLinks: socialLinks ?? undefined,
    };
    this.successMessage.set('');
    this.errorMessage.set('');
    this.userStore.saveProfile(dto).subscribe({
      next: () => {
        this.successMessage.set('Profil mis à jour avec succès.');
        setTimeout(() => this.successMessage.set(''), 4000);
      },
      error: () => this.errorMessage.set('Une erreur est survenue. Réessayez.'),
    });
  }
}
