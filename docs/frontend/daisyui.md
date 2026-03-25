# DaisyUI & Thème

## Setup

DaisyUI 5 est installé comme plugin Tailwind CSS 4. PrimeNG a été retiré.

### Styles (`styles.css`)

```css
@import "tailwindcss";
@plugin "daisyui" {
  themes:
    tameri --default,
    dark;
}

@plugin "daisyui/theme" {
  name: "tameri";
  default: true;
  color-scheme: light;
  --color-primary: oklch(58.5% 0.233 277.117); /* Indigo 600 */
  --color-secondary: oklch(65.7% 0.199 298.082); /* Violet */
  --color-accent: oklch(76.9% 0.188 70.08); /* Ambre */
  --color-success: oklch(64.8% 0.15 160); /* Vert */
  --color-warning: oklch(75% 0.183 55.934); /* Orange */
  --color-error: oklch(63.7% 0.237 25.331); /* Rouge */
  /* ... autres tokens */
}
```

### Override global du focus

Le focus par défaut de DaisyUI utilise `base-content` (noir). Un override global force la couleur `primary` (indigo) :

```css
.input:focus,
.input:focus-within,
.select:focus,
.textarea:focus {
  --input-color: var(--color-primary);
}
```

## Composants DaisyUI utilisés

| Composant DaisyUI             | Usage dans Tameri                        |
| ----------------------------- | ---------------------------------------- |
| `btn`                         | Boutons (primary, ghost, outline, sizes) |
| `card`                        | Sections de formulaire, cards média      |
| `input`, `textarea`, `select` | Champs de formulaire                     |
| `checkbox`                    | Sélection de catégories                  |
| `badge`                       | Type média, statut, mots-clés            |
| `alert`                       | Messages erreur/succès                   |
| `table`                       | Liste des médias (console)               |
| `progress`                    | Barre d'upload                           |
| `loading`                     | Spinners                                 |
| `navbar`                      | Header de navigation                     |
| `avatar`                      | Photo auteur, initiales                  |
| `collapse`                    | FAQ accordéon                            |
| `divider`                     | Séparateurs                              |
| `modal`                       | (disponible, pas encore utilisé)         |

## Couleurs sémantiques

| Token              | Couleur      | Usage                                   |
| ------------------ | ------------ | --------------------------------------- |
| `primary`          | Indigo       | Focus, boutons principaux, liens actifs |
| `secondary`        | Violet       | Badges vidéo                            |
| `accent`           | Ambre        | Badges audio                            |
| `success`          | Vert         | Badges "publié", alertes succès         |
| `warning`          | Orange       | Badges "archivé", dépublier             |
| `error`            | Rouge        | Alertes erreur, supprimer               |
| `info`             | Bleu         | Badges image/photo                      |
| `base-100/200/300` | Blanc → gris | Fonds, cartes, bordures                 |

## Migration depuis PrimeNG

| Avant (PrimeNG)                   | Après (DaisyUI)                    |
| --------------------------------- | ---------------------------------- |
| `providePrimeNG({ theme: Aura })` | Retiré de `app.config.ts`          |
| `pInputText`, `p-password`        | `input input-bordered`             |
| `p-button`                        | `btn btn-primary`                  |
| `p-message`                       | `alert alert-error`                |
| `p-card`                          | `card`                             |
| `tailwindcss-primeui`             | `@plugin "daisyui"`                |
| `bg-surface-0`, `text-color`      | `bg-base-100`, `text-base-content` |

## Dark Mode

Le thème `dark` est disponible mais pas activé par défaut. Pour l'activer, ajouter `data-theme="dark"` sur `<html>`.
