import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-about',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="max-w-3xl mx-auto py-12 px-4">
      <h1 class="text-3xl font-bold mb-2">À propos de Tameri</h1>
      <p class="text-base-content/60 mb-8">
        La plateforme qui valorise la créativité africaine.
      </p>

      <div class="prose max-w-none">
        <section class="mb-8">
          <h2 class="text-xl font-semibold mb-3">Notre mission</h2>
          <p class="text-base-content/70 leading-relaxed">
            Tameri est une plateforme de partage et de découverte de contenus
            créatifs — images, vidéos, audio et illustrations. Notre objectif
            est de donner aux créateurs africains un espace pour publier,
            protéger et monétiser leurs œuvres, tout en offrant aux
            professionnels et particuliers un accès à des contenus authentiques
            et de qualité.
          </p>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold mb-3">Ce que nous proposons</h2>
          <div class="grid gap-4 sm:grid-cols-2">
            <div class="card bg-base-100 border border-base-300">
              <div class="card-body p-5">
                <h3 class="card-title text-base">Pour les créateurs</h3>
                <p class="text-sm text-base-content/60">
                  Publiez vos photos, vidéos et fichiers audio. Définissez vos
                  prix, suivez vos statistiques et touchez une audience
                  grandissante.
                </p>
              </div>
            </div>
            <div class="card bg-base-100 border border-base-300">
              <div class="card-body p-5">
                <h3 class="card-title text-base">Pour les utilisateurs</h3>
                <p class="text-sm text-base-content/60">
                  Explorez des milliers de contenus classés par catégories.
                  Téléchargez des médias libres ou premium pour vos projets.
                </p>
              </div>
            </div>
          </div>
        </section>

        <section class="mb-8">
          <h2 class="text-xl font-semibold mb-3">Nos valeurs</h2>
          <ul class="space-y-3">
            <li class="flex items-start gap-3">
              <span class="badge badge-primary badge-sm mt-1">1</span>
              <div>
                <strong>Authenticité</strong>
                <p class="text-sm text-base-content/60 mt-0.5">
                  Nous mettons en avant des contenus originaux qui reflètent la
                  richesse culturelle du continent.
                </p>
              </div>
            </li>
            <li class="flex items-start gap-3">
              <span class="badge badge-primary badge-sm mt-1">2</span>
              <div>
                <strong>Accessibilité</strong>
                <p class="text-sm text-base-content/60 mt-0.5">
                  Une plateforme simple et rapide, pensée pour fonctionner même
                  avec une connexion modeste.
                </p>
              </div>
            </li>
            <li class="flex items-start gap-3">
              <span class="badge badge-primary badge-sm mt-1">3</span>
              <div>
                <strong>Rémunération juste</strong>
                <p class="text-sm text-base-content/60 mt-0.5">
                  Les créateurs fixent leurs tarifs et conservent la majorité de
                  leurs revenus.
                </p>
              </div>
            </li>
          </ul>
        </section>

        <section>
          <h2 class="text-xl font-semibold mb-3">Rejoignez-nous</h2>
          <p class="text-base-content/70 leading-relaxed mb-4">
            Que vous soyez photographe, vidéaste, musicien ou illustrateur,
            Tameri est votre vitrine. Créez votre compte gratuitement et
            commencez à partager vos créations dès aujourd'hui.
          </p>
          <div class="flex gap-3">
            <a routerLink="/auth/register" class="btn btn-primary btn-sm">
              Créer un compte
            </a>
            <a routerLink="/info/contact" class="btn btn-ghost btn-sm">
              Nous contacter
            </a>
          </div>
        </section>
      </div>
    </div>
  `,
})
export class AboutComponent {}
