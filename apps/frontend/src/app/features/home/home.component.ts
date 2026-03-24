import {
  Component,
  inject,
  OnInit,
  signal,
  computed,
  HostListener,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ApiService } from '../../core/services/api.service';
import { Topic } from '../../shared/models/topic.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, RouterLink, FormsModule],
  styles: [
    `
      :host {
        display: block;
      }

      .honeycomb {
        width: 100%;
        overflow: hidden;
      }

      .hex-row {
        display: flex;
        margin-left: calc((var(--hex-size) + var(--hex-margin) * 2) * -1);
      }

      .hex-row + .hex-row {
        margin-top: calc(var(--hex-gap) * -1);
      }

      .hex-row.even {
        margin-left: calc(
          var(--hex-size) / 2 +
            var(--hex-margin) - var(--hex-size) - var(--hex-margin) * 2
        );
      }

      .hex-item {
        flex-shrink: 0;
        width: var(--hex-size);
        margin: 0 var(--hex-margin);
        cursor: pointer;
        transition:
          transform 0.3s ease,
          opacity 0.3s ease;
      }

      .hex-item:hover {
        transform: scale(1.08);
        opacity: 0.85;
        z-index: 1;
        position: relative;
      }

      .hex-item img {
        width: 100%;
        height: auto;
        display: block;
      }
    `,
  ],
  template: `
    <!-- Section 1: Search (Google-style) -->
    <section
      class="flex flex-col items-center justify-center px-4 pt-16 pb-12"
      style="min-height: 50vh"
    >
      <img
        src="images/tameri-logo.png"
        alt="Tameri"
        class="h-28 w-auto object-contain mb-4"
      />
      <h1 class="text-4xl md:text-5xl font-bold text-gray-900 text-center mb-2">
        Tameri
      </h1>
      <p class="text-gray-500 text-lg mb-10">Beautiful Inspiration Ground</p>

      <!-- Search bar -->
      <div class="w-full max-w-xl">
        <div class="relative">
          <svg
            class="absolute left-4 top-1/2 -translate-y-1/2 w-5 h-5 text-gray-400"
            fill="none"
            stroke="currentColor"
            viewBox="0 0 24 24"
          >
            <path
              stroke-linecap="round"
              stroke-linejoin="round"
              stroke-width="2"
              d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
            />
          </svg>
          <input
            type="text"
            [(ngModel)]="searchQuery"
            (keydown.enter)="onSearch()"
            placeholder="Rechercher des images, vidéos, audio..."
            class="w-full pl-12 pr-4 py-3.5 border border-gray-300 rounded-full text-sm focus:outline-none focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 shadow-sm hover:shadow transition-shadow"
          />
        </div>

        <!-- Buttons -->
        <div class="flex justify-center gap-4 mt-6">
          <button
            (click)="onSearch()"
            class="inline-flex items-center gap-2 bg-indigo-600 hover:bg-indigo-700 text-white text-sm font-medium px-8 py-3 rounded-full shadow-sm hover:shadow-md transition-all"
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
                d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z"
              />
            </svg>
            Rechercher
          </button>
          <button
            routerLink="/explorer"
            class="inline-flex items-center gap-2 bg-white hover:bg-gray-50 border border-gray-300 text-gray-700 text-sm font-medium px-8 py-3 rounded-full shadow-sm hover:shadow-md transition-all"
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
                d="M4 6h16M4 10h16M4 14h16M4 18h16"
              />
            </svg>
            Explorer tout
          </button>
        </div>

        <!-- Media type buttons -->
        <div class="flex justify-center gap-6 sm:gap-10 mt-10">
          <a
            routerLink="/explorer"
            [queryParams]="{ type: 'image' }"
            class="flex flex-col items-center gap-2 no-underline group"
          >
            <img
              src="images/camera.png"
              alt="Photos"
              class="h-14 sm:h-16 w-auto object-contain transition-transform group-hover:scale-110"
            />
            <span
              class="text-xs sm:text-sm text-gray-500 group-hover:text-gray-900 font-medium transition-colors"
              >Photos</span
            >
          </a>
          <a
            routerLink="/explorer"
            [queryParams]="{ type: 'video' }"
            class="flex flex-col items-center gap-2 no-underline group"
          >
            <img
              src="images/video.png"
              alt="Vidéos"
              class="h-14 sm:h-16 w-auto object-contain transition-transform group-hover:scale-110"
            />
            <span
              class="text-xs sm:text-sm text-gray-500 group-hover:text-gray-900 font-medium transition-colors"
              >Vidéos</span
            >
          </a>
          <a
            routerLink="/explorer"
            [queryParams]="{ type: 'audio' }"
            class="flex flex-col items-center gap-2 no-underline group"
          >
            <img
              src="images/audio.png"
              alt="Audio"
              class="h-14 sm:h-16 w-auto object-contain transition-transform group-hover:scale-110"
            />
            <span
              class="text-xs sm:text-sm text-gray-500 group-hover:text-gray-900 font-medium transition-colors"
              >Audio</span
            >
          </a>
          <a
            routerLink="/explorer"
            [queryParams]="{ type: 'illustration' }"
            class="flex flex-col items-center gap-2 no-underline group"
          >
            <img
              src="images/illustration.png"
              alt="Illustrations"
              class="h-14 sm:h-16 w-auto object-contain transition-transform group-hover:scale-110"
            />
            <span
              class="text-xs sm:text-sm text-gray-500 group-hover:text-gray-900 font-medium transition-colors"
              >Illustrations</span
            >
          </a>
        </div>

        <!-- Category chips -->
        @if (topics().length > 0) {
          <div class="flex flex-wrap justify-center gap-2 mt-8">
            @for (topic of topics().slice(0, 8); track topic._id) {
              <a
                [routerLink]="['/topics', topic.slug]"
                class="text-gray-500 hover:text-indigo-600 border border-gray-200 hover:border-indigo-300 rounded-full px-4 py-1.5 text-xs font-medium no-underline transition-colors"
              >
                {{ topic.name }}
              </a>
            }
          </div>
        }
      </div>
    </section>

    <!-- Section 2: Hexagon Honeycomb (full width, repeating) -->
    <section
      class="honeycomb mb-12"
      [style.--hex-size]="hexSize + 'px'"
      [style.--hex-margin]="hexMargin + 'px'"
      [style.--hex-gap]="hexGap + 'px'"
    >
      @for (row of hexRows(); track $index) {
        <div class="hex-row" [class.even]="$index % 2 === 1">
          @for (imgIdx of row; track $index) {
            <div class="hex-item">
              <img
                [src]="'images/hexaimage/' + pad(imgIdx) + '.png'"
                [alt]="'Mosaic ' + imgIdx"
                loading="lazy"
              />
            </div>
          }
        </div>
      }
    </section>
  `,
})
export class HomeComponent implements OnInit {
  private readonly api = inject(ApiService);
  private readonly router = inject(Router);

  searchQuery = '';
  topics = signal<Topic[]>([]);

  private readonly totalImages = 36;
  private screenWidth = signal(
    typeof window !== 'undefined' ? window.innerWidth : 1200,
  );

  // Hex sizing — responsive
  get hexSize(): number {
    const w = this.screenWidth();
    if (w < 480) return 70;
    if (w < 768) return 90;
    return 130;
  }

  get hexMargin(): number {
    return this.hexSize < 90 ? 2 : 4;
  }

  get hexGap(): number {
    // Vertical overlap — hexagons have ~25% transparent top/bottom points
    return Math.round(this.hexSize * 0.22);
  }

  // Calculate how many hexagons per row to fill the screen width
  hexRows = computed(() => {
    const w = this.screenWidth();
    const cellWidth = this.hexSize + this.hexMargin * 2;
    const perRow = Math.ceil(w / cellWidth) + 3; // +3 to overflow both edges
    const numRows = 5;
    const rows: number[][] = [];

    for (let r = 0; r < numRows; r++) {
      const count = r % 2 === 1 ? perRow : perRow;
      const row: number[] = [];
      for (let c = 0; c < count; c++) {
        // Cycle through the 36 images
        const imgIdx = ((r * perRow + c) % this.totalImages) + 1;
        row.push(imgIdx);
      }
      rows.push(row);
    }
    return rows;
  });

  @HostListener('window:resize')
  onResize() {
    this.screenWidth.set(window.innerWidth);
  }

  ngOnInit() {
    this.loadData();
  }

  pad(n: number): string {
    return n.toString().padStart(2, '0');
  }

  onSearch() {
    if (this.searchQuery.trim()) {
      this.router.navigate(['/search'], {
        queryParams: { q: this.searchQuery },
      });
    } else {
      this.router.navigate(['/explorer']);
    }
  }

  private loadData() {
    this.api.get<Topic[]>('/topics').subscribe({
      next: (data) => this.topics.set(data),
      error: () => {},
    });
  }
}
