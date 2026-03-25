import { Component } from '@angular/core';

@Component({
  selector: 'app-privacy',
  standalone: true,
  template: `
    <div class="max-w-3xl mx-auto py-12 px-4">
      <h1 class="text-3xl font-bold mb-2">Politique de confidentialité</h1>
      <p class="text-base-content/60 text-sm mb-8">
        Dernière mise à jour : mars 2026
      </p>

      <div class="space-y-8 text-sm text-base-content/70 leading-relaxed">
        <section>
          <h2 class="text-lg font-semibold text-base-content mb-2">
            1. Données collectées
          </h2>
          <p>Lorsque vous utilisez Tameri, nous collectons :</p>
          <ul class="list-disc pl-5 mt-2 space-y-1">
            <li>
              <strong>Données de compte</strong> : nom, adresse email, mot de
              passe (chiffré).
            </li>
            <li>
              <strong>Données de profil</strong> : photo, biographie,
              occupation, liens sociaux — fournies volontairement.
            </li>
            <li>
              <strong>Contenus publiés</strong> : fichiers uploadés, métadonnées
              (titre, description, mots-clés).
            </li>
            <li>
              <strong>Données techniques</strong> : adresse IP, type de
              navigateur, pages consultées — collectées automatiquement pour
              améliorer le service.
            </li>
          </ul>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-base-content mb-2">
            2. Utilisation des données
          </h2>
          <p>Vos données sont utilisées pour :</p>
          <ul class="list-disc pl-5 mt-2 space-y-1">
            <li>Gérer votre compte et authentifier vos sessions.</li>
            <li>
              Afficher et distribuer vos contenus selon vos paramètres de
              publication.
            </li>
            <li>Traiter les transactions (achats, paiements aux créateurs).</li>
            <li>
              Améliorer la plateforme (statistiques anonymisées, performances).
            </li>
            <li>
              Vous envoyer des notifications liées à votre compte (jamais de
              spam commercial sans votre consentement).
            </li>
          </ul>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-base-content mb-2">
            3. Partage des données
          </h2>
          <p>
            Nous ne vendons jamais vos données personnelles. Elles peuvent être
            partagées avec :
          </p>
          <ul class="list-disc pl-5 mt-2 space-y-1">
            <li>
              <strong>Prestataires techniques</strong> : hébergement, traitement
              des paiements, envoi d'emails — uniquement dans la mesure
              nécessaire au fonctionnement du service.
            </li>
            <li>
              <strong>Autorités légales</strong> : en cas d'obligation
              juridique.
            </li>
          </ul>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-base-content mb-2">
            4. Stockage et sécurité
          </h2>
          <p>
            Vos données sont stockées sur des serveurs sécurisés. Les mots de
            passe sont chiffrés. Les fichiers sont hébergés sur une
            infrastructure de stockage objet avec accès restreint. Nous mettons
            en œuvre des mesures de sécurité conformes aux standards de
            l'industrie.
          </p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-base-content mb-2">
            5. Vos droits
          </h2>
          <p>Vous pouvez à tout moment :</p>
          <ul class="list-disc pl-5 mt-2 space-y-1">
            <li>
              <strong>Accéder</strong> à vos données personnelles depuis votre
              profil.
            </li>
            <li><strong>Modifier</strong> ou corriger vos informations.</li>
            <li>
              <strong>Supprimer</strong> votre compte et les données associées.
            </li>
            <li><strong>Exporter</strong> vos données sur demande.</li>
          </ul>
          <p class="mt-2">
            Pour exercer ces droits, contactez-nous à
            <strong>contact&#64;tameribig.kamitbrains.fr</strong>.
          </p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-base-content mb-2">
            6. Cookies
          </h2>
          <p>
            Tameri utilise des cookies essentiels au fonctionnement du service
            (authentification, sessions). Aucun cookie publicitaire ou de
            tracking tiers n'est utilisé.
          </p>
        </section>

        <section>
          <h2 class="text-lg font-semibold text-base-content mb-2">
            7. Modifications
          </h2>
          <p>
            Cette politique peut être mise à jour. En cas de modification
            significative, vous serez informé par email ou notification sur la
            plateforme.
          </p>
        </section>
      </div>
    </div>
  `,
})
export class PrivacyComponent {}
