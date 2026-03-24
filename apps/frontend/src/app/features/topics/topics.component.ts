import { Component, inject, OnInit, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterLink } from '@angular/router';
import { ApiService } from '../../core/services/api.service';
import { Topic } from '../../shared/models/topic.model';
import { MOCK_TOPICS } from '../../shared/data/mock-topics';

@Component({
  selector: 'app-topics',
  standalone: true,
  imports: [CommonModule, RouterLink],
  styles: [
    `
      .honeycomb {
        --hex-size: 140px;
        --hex-margin: 5px;
        --hex-gap: 20px;
      }

      @media (max-width: 768px) {
        .honeycomb {
          --hex-size: 100px;
          --hex-margin: 3px;
          --hex-gap: 14px;
        }
      }

      @media (max-width: 480px) {
        .honeycomb {
          --hex-size: 80px;
          --hex-margin: 2px;
          --hex-gap: 10px;
        }
      }

      .hex-row {
        display: flex;
        justify-content: center;
        gap: calc(var(--hex-margin) * 2);
      }

      .hex-row + .hex-row {
        margin-top: calc(var(--hex-gap) * -1);
      }

      .hex-row.offset {
        padding-left: calc(var(--hex-size) / 2 + var(--hex-margin));
        padding-right: calc(var(--hex-size) / 2 + var(--hex-margin));
      }

      .hex-link {
        position: relative;
        width: var(--hex-size);
        flex-shrink: 0;
        cursor: pointer;
        transition: transform 0.3s ease;
      }

      .hex-link:hover {
        transform: scale(1.1);
        z-index: 1;
      }

      .hex-link img {
        width: 100%;
        height: auto;
        display: block;
      }

      .hex-label {
        position: absolute;
        top: 50%;
        left: 50%;
        transform: translate(-50%, -50%);
        text-align: center;
        width: 75%;
        color: white;
        font-weight: 700;
        font-size: 13px;
        line-height: 1.2;
        text-shadow: 0 1px 6px rgba(0, 0, 0, 0.5);
        pointer-events: none;
      }

      @media (max-width: 768px) {
        .hex-label {
          font-size: 10px;
        }
      }

      @media (max-width: 480px) {
        .hex-label {
          font-size: 8px;
        }
      }

      .hex-disabled {
        width: var(--hex-size);
        flex-shrink: 0;
        opacity: 0.15;
      }

      .hex-disabled img {
        width: 100%;
        height: auto;
        display: block;
      }
    `,
  ],
  template: `
    <div class="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
      <!-- Header -->
      <div class="text-center mb-12">
        <h1 class="text-3xl font-bold text-gray-900">Catégories</h1>
        <p class="text-gray-500 mt-2">
          Parcourir les différentes
          <strong class="text-gray-700">catégories</strong>
        </p>
      </div>

      <!-- Loading -->
      @if (loading()) {
        <div class="flex justify-center py-20">
          <div class="animate-pulse flex gap-4">
            @for (i of [1, 2, 3, 4]; track i) {
              <div class="w-32 h-36 bg-gray-200 rounded-lg"></div>
            }
          </div>
        </div>
      } @else if (hexRows().length > 0) {
        <!-- Hexagon honeycomb -->
        <div class="honeycomb overflow-hidden">
          @for (row of hexRows(); track $index) {
            <div class="hex-row" [class.offset]="$index % 2 === 1">
              <!-- Disabled hex at start of odd rows -->
              @if ($index % 2 === 1) {
                <div class="hex-disabled">
                  <img src="images/hexaimage/01.png" alt="" />
                </div>
              }
              @for (topic of row; track topic._id) {
                <a
                  [routerLink]="['/topics', topic.slug]"
                  class="hex-link no-underline"
                >
                  <img
                    [src]="'images/hexaimage/' + pad(topic.hexImg) + '.png'"
                    [alt]="topic.name"
                  />
                  <span class="hex-label">{{ topic.name }}</span>
                </a>
              }
              <!-- Disabled hex at end of odd rows -->
              @if ($index % 2 === 1) {
                <div class="hex-disabled">
                  <img src="images/hexaimage/02.png" alt="" />
                </div>
              }
            </div>
          }
        </div>

        <!-- List view below -->
        <div class="mt-16 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
          @for (topic of topics(); track topic._id) {
            <a
              [routerLink]="['/topics', topic.slug]"
              class="group flex items-center gap-4 bg-white border border-gray-200 rounded-xl p-4 no-underline transition-all hover:shadow-md hover:-translate-y-0.5"
            >
              <div
                class="w-12 h-12 rounded-xl flex items-center justify-center shrink-0"
                [style.background]="gradients[$index % gradients.length]"
              >
                <svg
                  class="w-5 h-5 text-white/80"
                  fill="none"
                  stroke="currentColor"
                  viewBox="0 0 24 24"
                >
                  <path
                    stroke-linecap="round"
                    stroke-linejoin="round"
                    stroke-width="1.5"
                    d="M19 11H5m14 0a2 2 0 012 2v6a2 2 0 01-2 2H5a2 2 0 01-2-2v-6a2 2 0 012-2m14 0V9a2 2 0 00-2-2M5 11V9a2 2 0 012-2m0 0V5a2 2 0 012-2h6a2 2 0 012 2v2M7 7h10"
                  />
                </svg>
              </div>
              <div class="min-w-0">
                <h2
                  class="text-sm font-semibold text-gray-900 group-hover:text-indigo-600 transition-colors truncate"
                >
                  {{ topic.name }}
                </h2>
                @if (topic.description) {
                  <p class="text-xs text-gray-500 mt-0.5 truncate">
                    {{ topic.description }}
                  </p>
                }
              </div>
            </a>
          }
        </div>
      } @else {
        <div class="flex flex-col items-center justify-center py-20">
          <img
            src="images/default.jpg"
            alt=""
            class="w-32 h-32 object-cover rounded-2xl opacity-40 mb-6"
          />
          <h2 class="text-xl font-semibold text-gray-900 mb-2">
            Aucune catégorie
          </h2>
          <p class="text-gray-500">
            Les catégories seront bientôt disponibles.
          </p>
        </div>
      }
    </div>
  `,
})
export class TopicsComponent implements OnInit {
  private readonly api = inject(ApiService);

  topics = signal<(Topic & { hexImg: number })[]>([]);
  loading = signal(true);
  hexRows = signal<(Topic & { hexImg: number })[][]>([]);

  gradients = [
    'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
    'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
    'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
    'linear-gradient(135deg, #43e97b 0%, #38f9d7 100%)',
    'linear-gradient(135deg, #fa709a 0%, #fee140 100%)',
    'linear-gradient(135deg, #a18cd1 0%, #fbc2eb 100%)',
    'linear-gradient(135deg, #fccb90 0%, #d57eeb 100%)',
    'linear-gradient(135deg, #e0c3fc 0%, #8ec5fc 100%)',
  ];

  ngOnInit() {
    this.api.get<Topic[]>('/topics').subscribe({
      next: (data) => this.setTopics(data.length > 0 ? data : MOCK_TOPICS),
      error: () => this.setTopics(MOCK_TOPICS),
    });
  }

  pad(n: number): string {
    return n.toString().padStart(2, '0');
  }

  private setTopics(data: Topic[]) {
    const withHex = data.map((t, i) => ({
      ...t,
      hexImg: (i % 36) + 1,
    }));
    this.topics.set(withHex);
    this.buildHexRows(withHex);
    this.loading.set(false);
  }

  private buildHexRows(items: (Topic & { hexImg: number })[]) {
    // Row pattern like legacy: pair(N) → impair(N-1) → pair(N) → impair(N-1)
    const perRow = 4;
    const rows: (Topic & { hexImg: number })[][] = [];
    let idx = 0;
    let rowNum = 0;
    while (idx < items.length) {
      const count = rowNum % 2 === 0 ? perRow : perRow - 1;
      rows.push(items.slice(idx, idx + count));
      idx += count;
      rowNum++;
    }
    this.hexRows.set(rows);
  }
}
