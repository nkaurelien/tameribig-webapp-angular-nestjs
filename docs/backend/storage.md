# Stockage — MinIO + imgproxy

## MinIO (S3-compatible)

MinIO fournit un stockage objet compatible S3. Le `StorageService` utilise `@aws-sdk/client-s3` v3.

**Configuration** (`.env`) :

```
S3_ENDPOINT=http://localhost:9000
S3_BUCKET=tameri-bucket
S3_ACCESS_KEY=minioadmin
S3_SECRET_KEY=minioadmin
S3_REGION=us-east-1
```

**Console MinIO** : http://localhost:9001

### Opérations

```typescript
// Upload
const result = await storageService.upload(file, "media/image.jpg");

// URL signée (téléchargement)
const url = await storageService.getSignedUrl("media/image.jpg");

// Suppression
await storageService.delete("media/image.jpg");
```

## imgproxy

imgproxy transforme les images à la volée depuis MinIO :

- Redimensionnement
- Conversion de format (WebP, AVIF, JPEG, PNG)
- Qualité ajustable

**Configuration** (`.env`) :

```
IMGPROXY_URL=http://localhost:8080
IMGPROXY_KEY=<hex-key>
IMGPROXY_SALT=<hex-salt>
```

### Génération d'URL

Le backend génère les URLs imgproxy pour les miniatures et previews stockées dans les documents `media`.

```typescript
// Exemple d'URL imgproxy
// http://localhost:8080/insecure/rs:fill:300:300/plain/s3://tameri-bucket/media/image.jpg@webp
```
