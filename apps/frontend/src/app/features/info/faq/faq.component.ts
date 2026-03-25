import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface FaqItem {
  question: string;
  answer: string;
}

@Component({
  selector: 'app-faq',
  standalone: true,
  imports: [RouterLink],
  template: `
    <div class="max-w-3xl mx-auto py-12 px-4">
      <h1 class="text-3xl font-bold mb-2">Questions fréquentes</h1>
      <p class="text-base-content/60 mb-8">
        Tout ce que vous devez savoir pour démarrer sur Tameri.
      </p>

      @for (section of sections; track section.title) {
        <div class="mb-8">
          <h2 class="text-lg font-semibold mb-3">{{ section.title }}</h2>
          <div class="space-y-2">
            @for (item of section.items; track item.question) {
              <div
                class="collapse collapse-arrow bg-base-100 border border-base-300"
              >
                <input type="radio" [name]="section.title" />
                <div class="collapse-title font-medium text-sm">
                  {{ item.question }}
                </div>
                <div class="collapse-content">
                  <p class="text-sm text-base-content/70 leading-relaxed">
                    {{ item.answer }}
                  </p>
                </div>
              </div>
            }
          </div>
        </div>
      }

      <div class="card bg-base-200 border border-base-300 mt-8">
        <div class="card-body text-center">
          <p class="text-sm text-base-content/60 mb-3">
            Vous ne trouvez pas la réponse à votre question ?
          </p>
          <a routerLink="/info/contact" class="btn btn-primary btn-sm mx-auto">
            Contactez-nous
          </a>
        </div>
      </div>
    </div>
  `,
})
export class FaqComponent {
  readonly sections: { title: string; items: FaqItem[] }[] = [
    {
      title: 'Général',
      items: [
        {
          question: "Qu'est-ce que Tameri ?",
          answer:
            'Tameri est une plateforme de partage de médias créatifs — photos, vidéos, audio et illustrations. Elle permet aux créateurs de publier et monétiser leurs œuvres, et aux utilisateurs de découvrir et télécharger des contenus de qualité.',
        },
        {
          question: "L'inscription est-elle gratuite ?",
          answer:
            'Oui, la création de compte est entièrement gratuite. Vous pouvez publier et explorer des contenus sans frais. Seuls les téléchargements de contenus premium sont payants.',
        },
        {
          question: 'Quels formats de fichiers sont acceptés ?',
          answer:
            'Images : JPEG, PNG, GIF, WebP. Vidéos : MP4. Audio : MP3, WAV. La taille maximale par fichier est de 50 Mo.',
        },
      ],
    },
    {
      title: 'Créateurs',
      items: [
        {
          question: 'Comment publier un média ?',
          answer:
            "Connectez-vous, accédez à Mes médias depuis le menu, puis cliquez sur Ajouter. Remplissez les informations (titre, description, catégorie) et uploadez votre fichier. Votre média sera en brouillon jusqu'à sa publication.",
        },
        {
          question: 'Puis-je fixer mon propre prix ?',
          answer:
            'Oui, vous définissez librement le prix de chaque média en FCFA. Vous pouvez aussi proposer des contenus gratuits pour gagner en visibilité.',
        },
        {
          question: 'Comment sont gérés les droits sur mes œuvres ?',
          answer:
            "Vous restez propriétaire de vos créations. En publiant sur Tameri, vous accordez une licence de diffusion à la plateforme. Les acheteurs obtiennent un droit d'utilisation selon les conditions que vous définissez.",
        },
      ],
    },
    {
      title: 'Compte & paiements',
      items: [
        {
          question: "J'ai oublié mon mot de passe, que faire ?",
          answer:
            'Cliquez sur « Oublié ? » sur la page de connexion. Un lien de réinitialisation sera envoyé à votre adresse email.',
        },
        {
          question: 'Quels moyens de paiement sont acceptés ?',
          answer:
            'Mobile Money (Orange Money, MTN MoMo), cartes bancaires (Visa, Mastercard) et PayPal. De nouveaux moyens de paiement seront ajoutés prochainement.',
        },
        {
          question: 'Comment supprimer mon compte ?',
          answer:
            'Rendez-vous dans Mon espace > Paramètres et cliquez sur Supprimer le compte. Vos données seront effacées sous 30 jours conformément à notre politique de confidentialité.',
        },
      ],
    },
  ];
}
