# Composants PrimeNG

## Setup

PrimeNG est configuré avec le thème **Aura** et intégré à Tailwind CSS via **tailwindcss-primeui**.

### Styles (`styles.css`)

```css
@import "tailwindcss";
@import "tailwindcss-primeui";
```

### Configuration (`app.config.ts`)

```typescript
import { providePrimeNG } from "primeng/config";
import Aura from "@primeng/themes/aura";

providePrimeNG({ theme: { preset: Aura } });
```

## Classes Tailwind PrimeUI

Le plugin `tailwindcss-primeui` ajoute des utilitaires qui s'adaptent au thème PrimeNG :

| Classe             | Usage                        |
| ------------------ | ---------------------------- |
| `text-primary`     | Couleur primaire du thème    |
| `text-color`       | Couleur de texte principale  |
| `text-muted-color` | Couleur de texte secondaire  |
| `bg-surface-0`     | Fond de surface (blanc/dark) |
| `bg-emphasis`      | Fond survolé                 |
| `bg-highlight`     | Fond surligné                |
| `border-surface`   | Bordure par défaut           |
| `rounded-border`   | Border radius du thème       |
| `bg-primary`       | Fond couleur primaire        |

Tous supportent les variantes : `dark:`, `hover:`, `sm:`, etc.

## Composants utilisés

### Auth

- **`InputText`** (`pInputText`) — Champs email
- **`Password`** (`p-password`) — Champs mot de passe avec toggle
- **`Button`** (`p-button`) — Boutons submit avec loading state
- **`Message`** (`p-message`) — Messages d'erreur/succès

### Home

- **`Card`** (`p-card`) — Cartes pour les catégories
- **`Skeleton`** (`p-skeleton`) — Placeholders de chargement
- **`Button`** (`p-button`) — CTA du hero

### Navigation

- **`Button`** (`p-button`) — Liens de navigation (text mode)

## Import des composants

En Angular 19 standalone, chaque composant PrimeNG est importé directement :

```typescript
import { Button } from 'primeng/button';
import { InputText } from 'primeng/inputtext';
import { Password } from 'primeng/password';

@Component({
  imports: [Button, InputText, Password],
  // ...
})
```
