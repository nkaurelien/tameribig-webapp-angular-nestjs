import { Component, OnInit, inject, signal } from '@angular/core';
import {
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { Router, RouterLink, ActivatedRoute } from '@angular/router';
import { forkJoin } from 'rxjs';
import {
  MediaApiService,
  UpdateMediaDto,
} from '../../../core/services/media-api.service';
import { ApiService } from '../../../core/services/api.service';
import { Media, MediaStatus } from '../../../shared/models/media.model';
import { Topic } from '../../../shared/models/topic.model';

@Component({
  selector: 'app-media-edit',
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
          <h1 class="text-xl font-bold">Modifier le média</h1>
          @if (currentMedia()) {
            <p class="text-sm text-base-content/60 truncate max-w-xs">
              {{ currentMedia()!.title }}
            </p>
          }
        </div>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <span class="loading loading-spinner loading-lg text-primary"></span>
        </div>
      } @else {
        @if (errorMessage()) {
          <div role="alert" class="alert alert-error mb-6">
            <span>{{ errorMessage() }}</span>
          </div>
        }

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
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
                    class="input input-bordered w-full"
                    [class.input-error]="
                      form.get('title')?.invalid && form.get('title')?.touched
                    "
                  />
                </div>

                <div class="form-control w-full">
                  <label class="label">
                    <span class="label-text">Description</span>
                  </label>
                  <textarea
                    formControlName="description"
                    rows="3"
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
                    placeholder="mot1, mot2, mot3"
                    class="input input-bordered w-full"
                  />
                  <label class="label">
                    <span class="label-text-alt text-base-content/50"
                      >Séparés par des virgules</span
                    >
                  </label>
                </div>

                <div class="form-control w-full">
                  <label class="label">
                    <span class="label-text">Prix (FCFA)</span>
                  </label>
                  <input
                    formControlName="price"
                    type="number"
                    min="0"
                    class="input input-bordered w-full"
                  />
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

          <!-- Publication -->
          <div class="card bg-base-100 border border-base-300">
            <div class="card-body">
              <h2 class="card-title text-base">Publication</h2>
              <div class="flex items-center justify-between">
                <div class="flex items-center gap-2">
                  <span class="text-sm">Statut actuel :</span>
                  <span class="badge badge-sm" [class]="statusBadgeClass()">
                    {{ statusLabel() }}
                  </span>
                </div>
                <div class="flex gap-2">
                  @if (currentMedia()?.status === MediaStatus.Draft) {
                    <button
                      type="button"
                      (click)="publish()"
                      [disabled]="publishing()"
                      class="btn btn-success btn-sm"
                    >
                      @if (publishing()) {
                        <span class="loading loading-spinner loading-xs"></span>
                      }
                      Publier
                    </button>
                  } @else if (
                    currentMedia()?.status === MediaStatus.Published
                  ) {
                    <button
                      type="button"
                      (click)="unpublish()"
                      [disabled]="publishing()"
                      class="btn btn-warning btn-sm"
                    >
                      @if (publishing()) {
                        <span class="loading loading-spinner loading-xs"></span>
                      }
                      Dépublier
                    </button>
                  }
                </div>
              </div>
            </div>
          </div>

          <!-- Submit -->
          <div class="flex items-center justify-end gap-3">
            <a routerLink="/console/media" class="btn btn-ghost"> Annuler </a>
            <button
              type="submit"
              [disabled]="saving() || form.invalid"
              class="btn btn-primary"
            >
              @if (saving()) {
                <span class="loading loading-spinner loading-sm"></span>
              }
              Enregistrer
            </button>
          </div>
        </form>
      }
    </div>
  `,
})
export class MediaEditComponent implements OnInit {
  private readonly mediaApi = inject(MediaApiService);
  private readonly api = inject(ApiService);
  private readonly route = inject(ActivatedRoute);
  private readonly router = inject(Router);

  readonly MediaStatus = MediaStatus;

  currentMedia = signal<Media | null>(null);
  topics = signal<Topic[]>([]);
  selectedTopics = signal<string[]>([]);
  loading = signal(true);
  saving = signal(false);
  publishing = signal(false);
  errorMessage = signal('');

  form = new FormGroup({
    title: new FormControl('', [Validators.required, Validators.minLength(3)]),
    description: new FormControl(''),
    keywords: new FormControl(''),
    price: new FormControl<number | null>(null, Validators.min(0)),
  });

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;

    forkJoin([
      this.mediaApi.getMyMedia(),
      this.api.get<Topic[]>('/topics'),
    ]).subscribe({
      next: ([allMedia, allTopics]) => {
        const item = allMedia.find((m) => m._id === id);
        if (!item) {
          this.router.navigate(['/console/media']);
          return;
        }
        this.currentMedia.set(item);
        this.topics.set(allTopics);
        this.selectedTopics.set(item.topics ?? []);
        this.form.patchValue({
          title: item.title,
          description: item.description ?? '',
          keywords: item.keywords.join(', '),
          price: item.price ?? null,
        });
        this.loading.set(false);
      },
      error: () => {
        this.errorMessage.set('Impossible de charger le média.');
        this.loading.set(false);
      },
    });
  }

  isTopicSelected(id: string): boolean {
    return this.selectedTopics().includes(id);
  }

  toggleTopic(id: string) {
    this.selectedTopics.update((current) =>
      current.includes(id) ? current.filter((t) => t !== id) : [...current, id],
    );
  }

  publish() {
    this.publishing.set(true);
    this.mediaApi.publishMedia(this.currentMedia()!._id!).subscribe({
      next: (updated) => {
        this.currentMedia.set(updated);
        this.publishing.set(false);
      },
      error: () => this.publishing.set(false),
    });
  }

  unpublish() {
    this.publishing.set(true);
    this.mediaApi.unpublishMedia(this.currentMedia()!._id!).subscribe({
      next: (updated) => {
        this.currentMedia.set(updated);
        this.publishing.set(false);
      },
      error: () => this.publishing.set(false),
    });
  }

  onSubmit() {
    if (this.form.invalid || !this.currentMedia()) return;

    const keywords = (this.form.value.keywords ?? '')
      .split(',')
      .map((k) => k.trim())
      .filter(Boolean);

    const dto: UpdateMediaDto = {
      title: this.form.value.title!,
      description: this.form.value.description ?? undefined,
      keywords,
      topics: this.selectedTopics(),
      price: this.form.value.price ?? undefined,
    };

    this.saving.set(true);
    this.errorMessage.set('');

    this.mediaApi.updateMedia(this.currentMedia()!._id!, dto).subscribe({
      next: () => this.router.navigate(['/console/media']),
      error: () => {
        this.errorMessage.set('Erreur lors de la sauvegarde. Réessayez.');
        this.saving.set(false);
      },
    });
  }

  statusLabel(): string {
    const m = this.currentMedia();
    if (!m) return '';
    const labels: Record<string, string> = {
      [MediaStatus.Draft]: 'Brouillon',
      [MediaStatus.Published]: 'Publié',
      [MediaStatus.Archived]: 'Archivé',
    };
    return labels[m.status] ?? m.status;
  }

  statusBadgeClass(): string {
    const m = this.currentMedia();
    if (!m) return '';
    const classes: Record<string, string> = {
      [MediaStatus.Draft]: 'badge-ghost',
      [MediaStatus.Published]: 'badge-success',
      [MediaStatus.Archived]: 'badge-warning',
    };
    return classes[m.status] ?? 'badge-ghost';
  }
}
