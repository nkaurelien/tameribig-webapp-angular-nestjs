import { Component, OnInit, OnDestroy, inject, signal } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { Location, DatePipe } from '@angular/common';
import { Meta, Title } from '@angular/platform-browser';
import { MediaApiService } from '../../core/services/media-api.service';
import { PublicMedia } from '../../shared/models/media.model';
import { siteConfig } from '../../core/site.config';

@Component({
  selector: 'app-media-detail',
  standalone: true,
  imports: [RouterLink, DatePipe],
  template: `
    @if (loading()) {
      <div class="flex justify-center py-24">
        <span class="loading loading-spinner loading-lg text-primary"></span>
      </div>
    } @else if (error()) {
      <div class="max-w-2xl mx-auto py-12 px-4 text-center">
        <div role="alert" class="alert alert-error mb-6">
          <span>{{ error() }}</span>
        </div>
        <button (click)="goBack()" class="btn btn-ghost btn-sm">
          &larr; Retour
        </button>
      </div>
    } @else if (media()) {
      <div class="max-w-6xl mx-auto py-8 px-4">
        <!-- Back button -->
        <button (click)="goBack()" class="btn btn-ghost btn-sm mb-6">
          <svg
            class="w-4 h-4"
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
          Retour
        </button>

        <div class="grid gap-8 lg:grid-cols-3">
          <!-- Left: Preview -->
          <div class="lg:col-span-2">
            <div
              class="card bg-base-100 border border-base-300 overflow-hidden"
            >
              @if (media()!.mediaType === 'image') {
                <figure class="bg-base-200">
                  <img
                    [src]="
                      media()!.urls.preview ||
                      media()!.urls.thumbnail ||
                      'images/default.jpg'
                    "
                    [alt]="media()!.title"
                    class="w-full max-h-[600px] object-contain"
                    (error)="onImageError($event)"
                  />
                </figure>
              } @else if (media()!.mediaType === 'video') {
                <div
                  class="bg-base-200 flex items-center justify-center aspect-video"
                >
                  <svg
                    class="w-16 h-16 text-base-content/20"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      stroke-linecap="round"
                      stroke-linejoin="round"
                      stroke-width="1.5"
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                </div>
              } @else {
                <div
                  class="bg-base-200 flex items-center justify-center aspect-video"
                >
                  <svg
                    class="w-16 h-16 text-base-content/20"
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
            </div>

            <!-- Description -->
            @if (media()!.description) {
              <div class="card bg-base-100 border border-base-300 mt-4">
                <div class="card-body">
                  <h2 class="card-title text-base">Description</h2>
                  <p
                    class="text-sm text-base-content/70 leading-relaxed whitespace-pre-line"
                  >
                    {{ media()!.description }}
                  </p>
                </div>
              </div>
            }
          </div>

          <!-- Right: Info + Download -->
          <div class="space-y-4">
            <!-- Title & Badges -->
            <div class="card bg-base-100 border border-base-300">
              <div class="card-body">
                <h1 class="text-xl font-bold">{{ media()!.title }}</h1>
                <div class="flex flex-wrap gap-2 mt-2">
                  <span class="badge" [class]="typeBadgeClass()">
                    {{ typeLabel() }}
                  </span>
                  @if (media()!.dimensions) {
                    <span class="badge badge-ghost">
                      {{ media()!.dimensions!.width }} &times;
                      {{ media()!.dimensions!.height }} px
                    </span>
                  }
                </div>

                <!-- Author -->
                <div
                  class="flex items-center gap-3 mt-4 pt-4 border-t border-base-200"
                >
                  <div class="avatar placeholder">
                    <div
                      class="bg-primary text-primary-content rounded-full w-10"
                    >
                      <span class="text-sm">{{
                        (media()!.author.displayName || 'A')[0].toUpperCase()
                      }}</span>
                    </div>
                  </div>
                  <div>
                    <p class="font-medium text-sm">
                      {{ media()!.author.displayName || 'Anonyme' }}
                    </p>
                    <p class="text-xs text-base-content/50">
                      Publié le {{ media()!.createdAt | date: 'dd/MM/yyyy' }}
                    </p>
                  </div>
                </div>
              </div>
            </div>

            <!-- Download -->
            <div class="card bg-base-100 border border-base-300">
              <div class="card-body">
                <h2 class="card-title text-base">Téléchargement</h2>

                <!-- Price -->
                <div class="flex items-center justify-between mb-4">
                  @if (!media()!.price || media()!.price === 0) {
                    <span class="badge badge-success badge-lg font-semibold"
                      >Gratuit</span
                    >
                  } @else {
                    <span class="text-xl font-bold text-primary">
                      {{ media()!.price }} {{ currency }}
                    </span>
                  }
                </div>

                <button
                  (click)="download()"
                  [disabled]="downloading()"
                  class="btn btn-primary w-full"
                >
                  @if (downloading()) {
                    <span class="loading loading-spinner loading-sm"></span>
                    Préparation...
                  } @else {
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
                        d="M4 16v1a3 3 0 003 3h10a3 3 0 003-3v-1m-4-4l-4 4m0 0l-4-4m4 4V4"
                      />
                    </svg>
                    Télécharger
                  }
                </button>

                @if (downloadError()) {
                  <div role="alert" class="alert alert-warning alert-sm mt-2">
                    <span class="text-xs">{{ downloadError() }}</span>
                  </div>
                }
              </div>
            </div>

            <!-- Stats & Actions -->
            <div class="card bg-base-100 border border-base-300">
              <div class="card-body">
                <div class="grid grid-cols-3 gap-4 text-center">
                  <div>
                    <p class="text-lg font-bold">
                      {{ media()!.metrics.views }}
                    </p>
                    <p class="text-xs text-base-content/50">Vues</p>
                  </div>
                  <div>
                    <p class="text-lg font-bold">
                      {{ media()!.metrics.upvotes }}
                    </p>
                    <p class="text-xs text-base-content/50">J'aime</p>
                  </div>
                  <div>
                    <p class="text-lg font-bold">
                      {{ media()!.metrics.downloads }}
                    </p>
                    <p class="text-xs text-base-content/50">Téléch.</p>
                  </div>
                </div>

                <div class="divider my-2"></div>

                <div class="flex gap-2">
                  <button
                    (click)="upvote()"
                    [disabled]="upvoting()"
                    class="btn btn-outline btn-sm flex-1"
                    [class.btn-primary]="hasUpvoted()"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z"
                      />
                    </svg>
                    J'aime
                  </button>
                  <button
                    (click)="copyLink()"
                    class="btn btn-outline btn-sm flex-1"
                  >
                    <svg
                      class="w-4 h-4"
                      fill="none"
                      stroke="currentColor"
                      viewBox="0 0 24 24"
                    >
                      <path
                        stroke-linecap="round"
                        stroke-linejoin="round"
                        stroke-width="2"
                        d="M8.684 13.342C8.886 12.938 9 12.482 9 12c0-.482-.114-.938-.316-1.342m0 2.684a3 3 0 110-2.684m0 2.684l6.632 3.316m-6.632-6l6.632-3.316m0 0a3 3 0 105.367-2.684 3 3 0 00-5.367 2.684zm0 9.316a3 3 0 105.368 2.684 3 3 0 00-5.368-2.684z"
                      />
                    </svg>
                    {{ linkCopied() ? 'Copié !' : 'Partager' }}
                  </button>
                </div>
              </div>
            </div>

            <!-- Keywords -->
            @if (media()!.keywords.length > 0) {
              <div class="card bg-base-100 border border-base-300">
                <div class="card-body">
                  <h2 class="card-title text-base">Mots-clés</h2>
                  <div class="flex flex-wrap gap-2">
                    @for (kw of media()!.keywords; track kw) {
                      <a
                        [routerLink]="['/search']"
                        [queryParams]="{ q: kw }"
                        class="badge badge-outline badge-sm no-underline"
                        >{{ kw }}</a
                      >
                    }
                  </div>
                </div>
              </div>
            }
          </div>
        </div>
      </div>
    }
  `,
})
export class MediaDetailComponent implements OnInit, OnDestroy {
  private readonly route = inject(ActivatedRoute);
  private readonly location = inject(Location);
  private readonly mediaApi = inject(MediaApiService);
  private readonly meta = inject(Meta);
  private readonly title = inject(Title);

  readonly currency = siteConfig.media.currency;

  media = signal<PublicMedia | null>(null);
  loading = signal(true);
  error = signal('');
  downloading = signal(false);
  downloadError = signal('');
  upvoting = signal(false);
  hasUpvoted = signal(false);
  linkCopied = signal(false);

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.mediaApi.getById(id).subscribe({
      next: (data) => {
        this.media.set(data);
        this.loading.set(false);
        this.updateMetaTags(data);
      },
      error: () => {
        this.error.set('Impossible de charger ce média.');
        this.loading.set(false);
      },
    });
  }

  ngOnDestroy() {
    this.title.setTitle(`${siteConfig.name} — ${siteConfig.tagline}`);
    this.meta.removeTag('property="og:title"');
    this.meta.removeTag('property="og:description"');
    this.meta.removeTag('property="og:image"');
    this.meta.removeTag('property="og:url"');
    this.meta.removeTag('property="og:type"');
    this.meta.removeTag('name="twitter:card"');
    this.meta.removeTag('name="twitter:title"');
    this.meta.removeTag('name="twitter:description"');
    this.meta.removeTag('name="twitter:image"');
    this.meta.removeTag('name="description"');
  }

  private updateMetaTags(media: PublicMedia) {
    const mediaTitle = `${media.title} — ${siteConfig.name}`;
    const description =
      media.description ||
      `${this.typeLabel()} par ${media.author.displayName || 'un créateur'} sur ${siteConfig.name}`;
    const image = media.urls.preview || media.urls.thumbnail || '';
    const url = window.location.href;

    this.title.setTitle(mediaTitle);

    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: mediaTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:image', content: image });
    this.meta.updateTag({ property: 'og:url', content: url });
    this.meta.updateTag({ property: 'og:type', content: 'article' });
    this.meta.updateTag({
      name: 'twitter:card',
      content: 'summary_large_image',
    });
    this.meta.updateTag({ name: 'twitter:title', content: mediaTitle });
    this.meta.updateTag({
      name: 'twitter:description',
      content: description,
    });
    this.meta.updateTag({ name: 'twitter:image', content: image });
  }

  goBack() {
    this.location.back();
  }

  download() {
    this.downloading.set(true);
    this.downloadError.set('');
    this.mediaApi.getDownloadUrl(this.media()!._id!).subscribe({
      next: (res) => {
        window.open(res.url, '_blank');
        this.downloading.set(false);
      },
      error: () => {
        this.downloadError.set('Connectez-vous pour télécharger ce fichier.');
        this.downloading.set(false);
      },
    });
  }

  upvote() {
    this.upvoting.set(true);
    this.mediaApi.upvote(this.media()!._id!).subscribe({
      next: () => {
        this.hasUpvoted.set(true);
        this.media.update((m) =>
          m
            ? {
                ...m,
                metrics: { ...m.metrics, upvotes: m.metrics.upvotes + 1 },
              }
            : m,
        );
        this.upvoting.set(false);
      },
      error: () => this.upvoting.set(false),
    });
  }

  copyLink() {
    navigator.clipboard.writeText(window.location.href);
    this.linkCopied.set(true);
    setTimeout(() => this.linkCopied.set(false), 2000);
  }

  typeLabel(): string {
    switch (this.media()?.mediaType) {
      case 'image':
        return 'Photo';
      case 'video':
        return 'Vidéo';
      case 'audio':
        return 'Audio';
      default:
        return '';
    }
  }

  typeBadgeClass(): string {
    switch (this.media()?.mediaType) {
      case 'image':
        return 'badge-info';
      case 'video':
        return 'badge-secondary';
      case 'audio':
        return 'badge-accent';
      default:
        return 'badge-ghost';
    }
  }

  onImageError(event: Event) {
    (event.target as HTMLImageElement).src = 'images/default.jpg';
  }
}
