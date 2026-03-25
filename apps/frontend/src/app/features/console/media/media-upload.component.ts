import { Component, OnInit, inject, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { MediaApiService } from '../../../core/services/media-api.service';
import { ApiService } from '../../../core/services/api.service';
import { Topic } from '../../../shared/models/topic.model';
import { MediaType } from '../../../shared/models/media.model';

@Component({
  selector: 'app-media-upload',
  standalone: true,
  imports: [ReactiveFormsModule, RouterLink],
  template: `
    <div>
      <!-- Header -->
      <div class="flex items-center gap-3 mb-6">
        <a
          routerLink="/console/media"
          class="text-gray-400 hover:text-gray-600 transition-colors no-underline"
        >
          <svg
            class="w-5 h-5"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M15 19l-7-7 7-7"
            />
          </svg>
        </a>
        <div>
          <h1 class="text-xl font-bold text-gray-900">Ajouter un média</h1>
          <p class="text-sm text-gray-500 mt-0.5">
            Uploadez une image, vidéo ou fichier audio
          </p>
        </div>
      </div>

      @if (uploadError()) {
        <div
          class="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-6"
        >
          {{ uploadError() }}
        </div>
      }

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
        <!-- File picker -->
        <div class="bg-white border border-gray-200 rounded-xl p-6">
          <h2 class="text-base font-semibold text-gray-900 mb-4">Fichier</h2>

          @if (!selectedFile()) {
            <label
              class="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer hover:border-indigo-400 hover:bg-indigo-50 transition-colors"
            >
              <svg
                class="w-8 h-8 text-gray-400 mb-2"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  stroke-linecap="round"
                  stroke-linejoin="round"
                  stroke-width="1.5"
                  d="M7 16a4 4 0 01-.88-7.903A5 5 0 1115.9 6L16 6a5 5 0 011 9.9M15 13l-3-3m0 0l-3 3m3-3v12"
                />
              </svg>
              <span class="text-sm text-gray-500"
                >Cliquez pour sélectionner un fichier</span
              >
              <span class="text-xs text-gray-400 mt-1"
                >Images, vidéos, audio — max 50 Mo</span
              >
              <input
                type="file"
                class="hidden"
                accept="image/*,video/*,audio/*"
                (change)="onFileSelected($event)"
              />
            </label>
          } @else {
            <div class="flex items-start gap-4">
              @if (filePreviewUrl()) {
                <img
                  [src]="filePreviewUrl()!"
                  alt="Aperçu"
                  class="w-24 h-24 object-cover rounded-lg border border-gray-200 shrink-0"
                />
              } @else {
                <div
                  class="w-24 h-24 bg-gray-100 rounded-lg flex items-center justify-center shrink-0"
                >
                  <svg
                    class="w-8 h-8 text-gray-400"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                    />
                  </svg>
                </div>
              }
              <div class="flex-1 min-w-0">
                <p class="text-sm font-medium text-gray-900 truncate">
                  {{ selectedFile()!.name }}
                </p>
                <p class="text-xs text-gray-500 mt-0.5">
                  {{ fileSizeLabel() }}
                </p>
                <button
                  type="button"
                  (click)="clearFile()"
                  class="mt-2 text-xs text-red-500 hover:text-red-700 font-medium"
                >
                  Changer de fichier
                </button>
              </div>
            </div>
          }
        </div>

        <!-- Metadata -->
        <div class="bg-white border border-gray-200 rounded-xl p-6">
          <h2 class="text-base font-semibold text-gray-900 mb-4">
            Informations
          </h2>
          <div class="space-y-4">
            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5"
                >Titre <span class="text-red-500">*</span></label
              >
              <input
                formControlName="title"
                type="text"
                placeholder="Titre du média"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
              @if (form.get('title')?.invalid && form.get('title')?.touched) {
                <p class="text-red-500 text-xs mt-1">
                  Le titre est requis (min. 3 caractères)
                </p>
              }
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5"
                >Description</label
              >
              <textarea
                formControlName="description"
                rows="3"
                placeholder="Décrivez votre média..."
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors resize-none"
              ></textarea>
            </div>

            <div>
              <label class="block text-sm font-medium text-gray-700 mb-1.5"
                >Mots-clés</label
              >
              <input
                formControlName="keywords"
                type="text"
                placeholder="nature, paysage, cameroun (séparés par des virgules)"
                class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
              />
              <p class="text-xs text-gray-400 mt-1">
                Séparez les mots-clés par des virgules
              </p>
            </div>

            <div class="grid grid-cols-2 gap-4">
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5"
                  >Type</label
                >
                <select
                  formControlName="mediaType"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors bg-white"
                >
                  <option value="image">Image</option>
                  <option value="video">Vidéo</option>
                  <option value="audio">Audio</option>
                </select>
              </div>
              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5"
                  >Prix (FCFA)</label
                >
                <input
                  formControlName="price"
                  type="number"
                  min="0"
                  placeholder="0"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>
            </div>
          </div>
        </div>

        <!-- Topics -->
        @if (topics().length > 0) {
          <div class="bg-white border border-gray-200 rounded-xl p-6">
            <h2 class="text-base font-semibold text-gray-900 mb-4">
              Catégories
            </h2>
            <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
              @for (topic of topics(); track topic._id) {
                <label class="flex items-center gap-2 cursor-pointer">
                  <input
                    type="checkbox"
                    [checked]="isTopicSelected(topic._id!)"
                    (change)="toggleTopic(topic._id!)"
                    class="w-4 h-4 text-indigo-600 border-gray-300 rounded focus:ring-indigo-500"
                  />
                  <span class="text-sm text-gray-700">{{ topic.name }}</span>
                </label>
              }
            </div>
          </div>
        }

        <!-- Submit -->
        <div class="flex items-center justify-end gap-3">
          <a
            routerLink="/console/media"
            class="px-4 py-2.5 text-sm text-gray-600 hover:text-gray-900 font-medium no-underline transition-colors"
          >
            Annuler
          </a>
          <button
            type="submit"
            [disabled]="uploading() || !selectedFile() || form.invalid"
            class="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-colors flex items-center gap-2"
          >
            @if (uploading()) {
              <div
                class="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"
              ></div>
              Envoi en cours...
            } @else {
              Publier le média
            }
          </button>
        </div>
      </form>
    </div>
  `,
})
export class MediaUploadComponent implements OnInit {
  private readonly mediaApi = inject(MediaApiService);
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  topics = signal<Topic[]>([]);
  selectedFile = signal<File | null>(null);
  filePreviewUrl = signal<string | null>(null);
  uploading = signal(false);
  uploadError = signal('');

  selectedTopics = signal<string[]>([]);

  form = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl(''),
    keywords: new FormControl(''),
    price: new FormControl<number | null>(null, Validators.min(0)),
    mediaType: new FormControl<'image' | 'video' | 'audio'>(
      'image',
      Validators.required,
    ),
  });

  ngOnInit() {
    this.api.get<Topic[]>('/topics').subscribe({
      next: (data) => this.topics.set(data),
    });
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) return;
    this.selectedFile.set(file);

    if (file.type.startsWith('image/')) {
      this.form.get('mediaType')!.setValue('image');
      const reader = new FileReader();
      reader.onload = (e) =>
        this.filePreviewUrl.set(e.target?.result as string);
      reader.readAsDataURL(file);
    } else if (file.type.startsWith('video/')) {
      this.form.get('mediaType')!.setValue('video');
      this.filePreviewUrl.set(null);
    } else if (file.type.startsWith('audio/')) {
      this.form.get('mediaType')!.setValue('audio');
      this.filePreviewUrl.set(null);
    }
  }

  clearFile() {
    this.selectedFile.set(null);
    this.filePreviewUrl.set(null);
  }

  fileSizeLabel(): string {
    const file = this.selectedFile();
    if (!file) return '';
    const mb = file.size / (1024 * 1024);
    return mb < 1
      ? `${(file.size / 1024).toFixed(0)} Ko`
      : `${mb.toFixed(1)} Mo`;
  }

  isTopicSelected(id: string): boolean {
    return this.selectedTopics().includes(id);
  }

  toggleTopic(id: string) {
    this.selectedTopics.update((current) =>
      current.includes(id) ? current.filter((t) => t !== id) : [...current, id],
    );
  }

  onSubmit() {
    if (this.form.invalid || !this.selectedFile()) return;

    const formData = new FormData();
    formData.append('file', this.selectedFile()!);
    formData.append('title', this.form.value.title!);

    if (this.form.value.description) {
      formData.append('description', this.form.value.description);
    }

    const keywords = (this.form.value.keywords ?? '')
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);
    keywords.forEach((k) => formData.append('keywords[]', k));

    this.selectedTopics().forEach((t) => formData.append('topics[]', t));

    if (this.form.value.price != null) {
      formData.append('price', String(this.form.value.price));
    }

    formData.append('mediaType', this.form.value.mediaType!);

    this.uploading.set(true);
    this.uploadError.set('');

    this.mediaApi.upload(formData).subscribe({
      next: () => this.router.navigate(['/console/media']),
      error: () => {
        this.uploadError.set(
          'Erreur lors du téléversement. Vérifiez le fichier et réessayez.',
        );
        this.uploading.set(false);
      },
    });
  }
}
