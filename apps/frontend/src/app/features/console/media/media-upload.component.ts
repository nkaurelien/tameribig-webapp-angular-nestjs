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
        <a routerLink="/console/media" class="btn btn-ghost btn-sm btn-circle">
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
          <h1 class="text-xl font-bold">Ajouter un média</h1>
          <p class="text-sm text-base-content/60">
            Uploadez une image, vidéo ou fichier audio
          </p>
        </div>
      </div>

      @if (uploadError()) {
        <div role="alert" class="alert alert-error mb-6">
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
              d="M12 9v2m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span>{{ uploadError() }}</span>
        </div>
      }

      @if (uploadSuccess()) {
        <div role="alert" class="alert alert-success mb-6">
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
              d="M9 12l2 2 4-4m6 2a9 9 0 11-18 0 9 9 0 0118 0z"
            />
          </svg>
          <span
            >Votre média a été soumis. Sa qualité sera étudiée avant
            publication.</span
          >
        </div>
      }

      <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
        <!-- File picker -->
        <div class="card bg-base-100 border border-base-300">
          <div class="card-body">
            <h2 class="card-title text-base">Fichier</h2>

            @if (!selectedFile()) {
              <label
                class="flex flex-col items-center justify-center w-full h-40 border-2 border-dashed rounded-box cursor-pointer transition-colors"
                [class]="
                  isDragging()
                    ? 'border-primary bg-primary/5'
                    : 'border-base-300 hover:border-primary hover:bg-base-200'
                "
                (dragover)="onDragOver($event)"
                (dragleave)="onDragLeave($event)"
                (drop)="onDrop($event)"
              >
                <svg
                  class="w-8 h-8 opacity-40 mb-2"
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
                <span class="text-sm text-base-content/60"
                  >Glissez un fichier ici ou cliquez pour sélectionner</span
                >
                <span class="text-xs text-base-content/40 mt-1"
                  >Images, vidéos, audio — max 50 Mo</span
                >
                <input
                  type="file"
                  class="hidden"
                  accept="image/jpeg,image/png,image/gif,image/webp,video/mp4,audio/mpeg,audio/wav"
                  (change)="onFileSelected($event)"
                />
              </label>
            } @else {
              <div class="flex items-start gap-4">
                @if (filePreviewUrl()) {
                  <div class="avatar">
                    <div class="w-24 rounded-lg">
                      <img [src]="filePreviewUrl()!" alt="Aperçu" />
                    </div>
                  </div>
                } @else {
                  <div
                    class="w-24 h-24 bg-base-200 rounded-lg flex items-center justify-center shrink-0"
                  >
                    <svg
                      class="w-8 h-8 opacity-40"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      @if (form.get('mediaType')?.value === 'video') {
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="1.5"
                          d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                        />
                      } @else {
                        <path
                          stroke-linecap="round"
                          stroke-linejoin="round"
                          stroke-width="1.5"
                          d="M9 19V6l12-3v13M9 19c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zm12-3c0 1.105-1.343 2-3 2s-3-.895-3-2 1.343-2 3-2 3 .895 3 2zM9 10l12-3"
                        />
                      }
                    </svg>
                  </div>
                }
                <div class="flex-1 min-w-0">
                  <p class="font-medium truncate">
                    {{ selectedFile()!.name }}
                  </p>
                  <p class="text-sm text-base-content/60 mt-0.5">
                    {{ fileSizeLabel() }}
                  </p>
                  <button
                    type="button"
                    (click)="clearFile()"
                    class="btn btn-ghost btn-xs text-error mt-2"
                  >
                    Changer de fichier
                  </button>
                </div>
              </div>
            }
          </div>
        </div>

        <!-- Upload progress -->
        @if (uploading()) {
          <div class="card bg-base-100 border border-base-300">
            <div class="card-body py-4">
              <div class="flex items-center justify-between mb-2">
                <span class="text-sm font-medium">Envoi en cours...</span>
                <span class="text-sm text-base-content/60"
                  >{{ uploadProgress() }}%</span
                >
              </div>
              <progress
                class="progress progress-primary w-full"
                [value]="uploadProgress()"
                max="100"
              ></progress>
            </div>
          </div>
        }

        <!-- Metadata -->
        <div class="card bg-base-100 border border-base-300">
          <div class="card-body">
            <h2 class="card-title text-base">Informations</h2>
            <div class="space-y-4">
              <div class="form-control w-full">
                <label class="label">
                  <span class="label-text"
                    >Titre <span class="text-error">*</span></span
                  >
                </label>
                <input
                  formControlName="title"
                  type="text"
                  placeholder="Titre du média"
                  class="input input-bordered w-full"
                  [class.input-error]="
                    form.get('title')?.invalid && form.get('title')?.touched
                  "
                />
                @if (form.get('title')?.invalid && form.get('title')?.touched) {
                  <label class="label">
                    <span class="label-text-alt text-error"
                      >Le titre est requis (min. 3 caractères)</span
                    >
                  </label>
                }
              </div>

              <div class="form-control w-full">
                <label class="label">
                  <span class="label-text">Description</span>
                </label>
                <textarea
                  formControlName="description"
                  rows="3"
                  placeholder="Décrivez votre média..."
                  class="textarea textarea-bordered w-full"
                ></textarea>
              </div>

              <div class="form-control w-full">
                <label class="label">
                  <span class="label-text">Mots-clés</span>
                </label>
                <input
                  formControlName="keywords"
                  type="text"
                  placeholder="nature, paysage, cameroun (séparés par des virgules)"
                  class="input input-bordered w-full"
                />
                <label class="label">
                  <span class="label-text-alt text-base-content/50"
                    >Séparez les mots-clés par des virgules</span
                  >
                </label>
              </div>

              <div class="grid grid-cols-2 gap-4">
                <div class="form-control w-full">
                  <label class="label">
                    <span class="label-text">Type</span>
                  </label>
                  <select
                    formControlName="mediaType"
                    class="select select-bordered w-full"
                  >
                    <option value="image">Image</option>
                    <option value="video">Vidéo</option>
                    <option value="audio">Audio</option>
                  </select>
                </div>
                <div class="form-control w-full">
                  <label class="label">
                    <span class="label-text">Prix (FCFA)</span>
                  </label>
                  <input
                    formControlName="price"
                    type="number"
                    min="0"
                    placeholder="0"
                    class="input input-bordered w-full"
                  />
                </div>
              </div>
            </div>
          </div>
        </div>

        <!-- Topics -->
        @if (topics().length > 0) {
          <div class="card bg-base-100 border border-base-300">
            <div class="card-body">
              <h2 class="card-title text-base">Catégories</h2>
              <div class="grid grid-cols-2 sm:grid-cols-3 gap-2">
                @for (topic of topics(); track topic._id) {
                  <label class="label cursor-pointer justify-start gap-3">
                    <input
                      type="checkbox"
                      [checked]="isTopicSelected(topic._id!)"
                      (change)="toggleTopic(topic._id!)"
                      class="checkbox checkbox-primary checkbox-sm"
                    />
                    <span class="label-text">{{ topic.name }}</span>
                  </label>
                }
              </div>
            </div>
          </div>
        }

        <!-- Submit -->
        <div class="flex items-center justify-end gap-3">
          <a routerLink="/console/media" class="btn btn-ghost"> Annuler </a>
          <button
            type="submit"
            [disabled]="uploading() || !selectedFile() || form.invalid"
            class="btn btn-primary"
          >
            @if (uploading()) {
              <span class="loading loading-spinner loading-sm"></span>
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
  uploadProgress = signal(0);
  uploadError = signal('');
  uploadSuccess = signal(false);
  isDragging = signal(false);

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

  onDragOver(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(true);
  }

  onDragLeave(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
  }

  onDrop(event: DragEvent) {
    event.preventDefault();
    event.stopPropagation();
    this.isDragging.set(false);
    const file = event.dataTransfer?.files[0];
    if (file) this.handleFile(file);
  }

  onFileSelected(event: Event) {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (file) this.handleFile(file);
  }

  private handleFile(file: File) {
    this.selectedFile.set(file);
    this.uploadError.set('');
    this.uploadSuccess.set(false);

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

    // Auto-fill title from filename if empty
    if (!this.form.get('title')!.value) {
      const name = file.name.replace(/\.[^/.]+$/, '').replace(/[_-]/g, ' ');
      this.form.get('title')!.setValue(name);
    }
  }

  clearFile() {
    this.selectedFile.set(null);
    this.filePreviewUrl.set(null);
    this.uploadProgress.set(0);
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

    // Merge user keywords + auto-generated from description
    const userKeywords = (this.form.value.keywords ?? '')
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

    const descKeywords = (this.form.value.description ?? '')
      .split(/\s+/)
      .filter((w) => w.length >= 3);

    const allKeywords = [...new Set([...userKeywords, ...descKeywords])];
    allKeywords.forEach((k) => formData.append('keywords[]', k));

    this.selectedTopics().forEach((t) => formData.append('topics[]', t));

    if (this.form.value.price != null) {
      formData.append('price', String(this.form.value.price));
    }

    formData.append('mediaType', this.form.value.mediaType!);

    this.uploading.set(true);
    this.uploadError.set('');
    this.uploadProgress.set(0);
    this.uploadSuccess.set(false);

    this.mediaApi.upload(formData).subscribe({
      next: () => {
        this.uploadSuccess.set(true);
        this.uploading.set(false);
        this.uploadProgress.set(100);
        setTimeout(() => this.router.navigate(['/console/media']), 1500);
      },
      error: () => {
        this.uploadError.set(
          'Erreur lors du téléversement. Vérifiez le fichier et réessayez.',
        );
        this.uploading.set(false);
        this.uploadProgress.set(0);
      },
    });
  }
}
