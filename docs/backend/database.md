# Base de données — CouchDB

## Connexion

CouchDB est accessible via le client `nano` encapsulé dans `CouchDbService` (module global).

**Configuration** (`.env`) :

```
COUCHDB_USER=admin
COUCHDB_PASSWORD=admin
COUCHDB_URL=http://admin:admin@localhost:5984
```

**Interface web** : http://localhost:5984/\_utils (Fauxton)

## Bases de données

| Nom                  | Contenu                  | Créée automatiquement |
| -------------------- | ------------------------ | --------------------- |
| `users`              | Profils utilisateurs     | Oui (module init)     |
| `topics`             | Catégories/sujets        | Oui                   |
| `media`              | Métadonnées des médias   | Oui                   |
| `notifications`      | Notifications            | Oui                   |
| `search_suggestions` | Suggestions de recherche | Oui                   |

## Patterns

### Documents

Les documents CouchDB sont définis comme des **interfaces TypeScript** (pas de classes/schemas) :

```typescript
export interface Topic extends MaybeDocument {
  type: "topic";
  name: string;
  slug: string;
  description?: string;
  createdAt: string;
  updatedAt?: string;
}
```

### Index

Les index sont créés dans le `onModuleInit()` de chaque service :

```typescript
async onModuleInit() {
  await this.couchDbService.createIndex('users', {
    fields: ['email'],
  });
}
```

### CRUD

Le `CouchDbService` fournit les opérations de base :

```typescript
// Créer/obtenir une base
const db = await this.couchDbService.getOrCreateDatabase<User>("users");

// Insérer
const result = await db.insert(document);

// Lire
const doc = await db.get(id);

// Chercher
const results = await db.find({ selector: { email } });

// Mettre à jour
await db.insert({ ...doc, ...updates });

// Supprimer
await db.destroy(id, rev);
```
