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
          <h1 class="text-xl font-bold text-gray-900">Modifier le média</h1>
          @if (currentMedia()) {
            <p class="text-sm text-gray-500 mt-0.5 truncate max-w-xs">
              {{ currentMedia()!.title }}
            </p>
          }
        </div>
      </div>

      @if (loading()) {
        <div class="flex justify-center py-12">
          <div
            class="w-8 h-8 border-4 border-indigo-200 border-t-indigo-600 rounded-full animate-spin"
          ></div>
        </div>
      } @else {
        @if (errorMessage()) {
          <div
            class="bg-red-50 border border-red-200 text-red-700 text-sm px-4 py-3 rounded-lg mb-6"
          >
            {{ errorMessage() }}
          </div>
        }

        <form [formGroup]="form" (ngSubmit)="onSubmit()" class="space-y-6">
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
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5"
                  >Description</label
                >
                <textarea
                  formControlName="description"
                  rows="3"
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
                  placeholder="mot1, mot2, mot3"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
                <p class="text-xs text-gray-400 mt-1">
                  Séparés par des virgules
                </p>
              </div>

              <div>
                <label class="block text-sm font-medium text-gray-700 mb-1.5"
                  >Prix (FCFA)</label
                >
                <input
                  formControlName="price"
                  type="number"
                  min="0"
                  class="w-full px-4 py-2.5 border border-gray-300 rounded-lg text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 transition-colors"
                />
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

          <!-- Actions -->
          <div class="bg-white border border-gray-200 rounded-xl p-6">
            <h2 class="text-base font-semibold text-gray-900 mb-4">
              Publication
            </h2>
            <div class="flex items-center justify-between">
              <div>
                <p class="text-sm text-gray-700">
                  Statut actuel :
                  <span
                    [class]="statusBadgeClass()"
                    class="ml-1 px-2 py-0.5 rounded text-xs font-medium"
                  >
                    {{ statusLabel() }}
                  </span>
                </p>
              </div>
              <div class="flex gap-2">
                @if (currentMedia()?.status === MediaStatus.Draft) {
                  <button
                    type="button"
                    (click)="publish()"
                    [disabled]="publishing()"
                    class="bg-green-600 hover:bg-green-700 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    {{ publishing() ? '...' : 'Publier' }}
                  </button>
                } @else if (currentMedia()?.status === MediaStatus.Published) {
                  <button
                    type="button"
                    (click)="unpublish()"
                    [disabled]="publishing()"
                    class="bg-orange-500 hover:bg-orange-600 disabled:opacity-50 text-white text-sm font-medium px-4 py-2 rounded-lg transition-colors"
                  >
                    {{ publishing() ? '...' : 'Dépublier' }}
                  </button>
                }
              </div>
            </div>
          </div>

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
              [disabled]="saving() || form.invalid"
              class="bg-indigo-600 hover:bg-indigo-700 disabled:opacity-50 text-white font-medium px-6 py-2.5 rounded-lg text-sm transition-colors"
            >
              {{ saving() ? 'Enregistrement...' : 'Enregistrer' }}
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
      [MediaStatus.Draft]: 'bg-gray-100 text-gray-600',
      [MediaStatus.Published]: 'bg-green-100 text-green-700',
      [MediaStatus.Archived]: 'bg-yellow-100 text-yellow-700',
    };
    return classes[m.status] ?? 'bg-gray-100 text-gray-600';
  }
}
