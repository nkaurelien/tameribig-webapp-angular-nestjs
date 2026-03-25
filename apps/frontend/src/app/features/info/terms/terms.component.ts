import { Component } from '@angular/core';

@Component({
  selector: 'app-terms',
  standalone: true,
  template: `
    <div class="max-w-3xl mx-auto py-12 px-4">
      <h1 class="text-3xl font-bold mb-2">
        Conditions générales d'utilisation
      </h1>
      <p class="text-base-content/60 text-sm mb-8">
        Dernière mise à jour : mars 2026
      </p>

      <div class="space-y-8 text-sm text-base-content/70 leading-relaxed">
        <section>
          <h2 class="text-lg font-semibold text-base-content mb-2">1. Objet</h2>
          <p>
            Les présentes conditions régissent l'utilisation de la plateforme
            Tameri, accessible à l'adresse tameribig.kamitbrains.fr. En créant
            un compte ou en utilisant le service, vous acceptez ces conditions
            dans leur intégralité.
          </p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-base-content mb-2">
            2. Inscription
          </h2>
          <p>
            L'inscription est ouverte à toute personne physique âgée d'au moins
            18 ans. Vous vous engagez à fournir des informations exactes et à
            maintenir la confidentialité de vos identifiants. Tout usage de
            votre compte relève de votre responsabilité.
          </p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-base-content mb-2">
            3. Publication de contenus
          </h2>
          <p>En publiant un contenu sur Tameri, vous déclarez :</p>
          <ul class="list-disc pl-5 mt-2 space-y-1">
            <li>Être l'auteur ou disposer des droits nécessaires.</li>
            <li>
              Ne pas porter atteinte aux droits de tiers (propriété
              intellectuelle, droit à l'image, vie privée).
            </li>
            <li>
              Ne pas diffuser de contenu illicite, violent, haineux ou
              pornographique.
            </li>
          </ul>
          <p class="mt-2">
            Tameri se réserve le droit de retirer tout contenu ne respectant pas
            ces règles, sans préavis.
          </p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-base-content mb-2">
            4. Propriété intellectuelle
          </h2>
          <p>
            Les créateurs conservent l'intégralité de leurs droits d'auteur. En
            publiant sur Tameri, vous accordez à la plateforme une licence non
            exclusive de diffusion, nécessaire au fonctionnement du service
            (affichage, miniatures, aperçus). Cette licence prend fin à la
            suppression du contenu.
          </p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-base-content mb-2">
            5. Achats et paiements
          </h2>
          <p>
            Les prix sont affichés en FCFA et fixés par les créateurs. Les
            paiements sont traités par des prestataires tiers sécurisés. Les
            achats de contenus numériques sont définitifs — aucun remboursement
            n'est possible sauf en cas d'erreur technique avérée.
          </p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-base-content mb-2">
            6. Responsabilité
          </h2>
          <p>
            Tameri met tout en œuvre pour assurer la disponibilité et la
            sécurité du service, mais ne garantit pas un fonctionnement sans
            interruption. La plateforme agit en tant qu'hébergeur et ne peut
            être tenue responsable des contenus publiés par les utilisateurs.
          </p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-base-content mb-2">
            7. Résiliation
          </h2>
          <p>
            Vous pouvez supprimer votre compte à tout moment. Tameri peut
            suspendre ou supprimer un compte en cas de violation des présentes
            conditions, après notification. Les contenus associés seront retirés
            dans un délai de 30 jours.
          </p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-base-content mb-2">
            8. Droit applicable
          </h2>
          <p>
            Les présentes conditions sont soumises au droit camerounais. En cas
            de litige, les parties s'engagent à rechercher une solution amiable
            avant toute action judiciaire.
          </p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-base-content mb-2">
            9. Contact
          </h2>
          <p>
            Pour toute question relative à ces conditions, contactez-nous à
            <strong>contact&#64;tameribig.kamitbrains.fr</strong>.
          </p>
        </section>
      </div>
    </div>
  `,
})
export class TermsComponent {}
