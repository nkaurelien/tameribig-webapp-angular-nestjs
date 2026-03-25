import { Topic } from '../topics/interfaces/topic.interface';
import {
  Media,
  MediaType,
  MediaStatus,
} from '../media/interfaces/media.interface';
import {
  SearchSuggestion,
  SearchSuggestionType,
} from '../search/interfaces/search-suggestion.interface';
import { User } from '../users/interfaces/user.interface';

const now = new Date().toISOString();

export interface DemoUser {
  email: string;
  firstName: string;
  lastName: string;
  roles: string[];
  occupation: string;
  about: string;
}

export const DEMO_USERS: DemoUser[] = [
  {
    email: 'admin@tameri.app',
    firstName: 'Admin',
    lastName: 'Tameri',
    roles: ['ADMIN', 'USER'],
    occupation: 'Administrateur',
    about: 'Administrateur de la plateforme Tameri.',
  },
  {
    email: 'editor@tameri.app',
    firstName: 'Marie',
    lastName: 'Nguema',
    roles: ['EDITOR', 'USER'],
    occupation: 'Éditrice',
    about: 'Curatrice de contenu et éditrice sur Tameri.',
  },
  {
    email: 'artist@tameri.app',
    firstName: 'Jean',
    lastName: 'Mbala',
    roles: ['USER'],
    occupation: 'Artiste digital',
    about: "Passionné de digital painting et d'illustration.",
  },
  {
    email: 'photographer@tameri.app',
    firstName: 'Aïcha',
    lastName: 'Diallo',
    roles: ['USER'],
    occupation: 'Photographe',
    about: 'Photographe professionnelle spécialisée en portraits.',
  },
  {
    email: 'musician@tameri.app',
    firstName: 'Kofi',
    lastName: 'Asante',
    roles: ['USER'],
    occupation: 'Musicien',
    about: 'Compositeur et producteur de musique afro-fusion.',
  },
];

export function buildUserDocument(
  demoUser: DemoUser,
  supertokensId: string,
): Omit<User, '_id' | '_rev'> {
  return {
    type: 'user',
    supertokensId,
    email: demoUser.email,
    username: demoUser.email.split('@')[0],
    fullname: `${demoUser.firstName} ${demoUser.lastName}`,
    displayName: `${demoUser.firstName} ${demoUser.lastName}`,
    firstName: demoUser.firstName,
    lastName: demoUser.lastName,
    roles: demoUser.roles,
    permissions: [],
    occupation: demoUser.occupation,
    about: demoUser.about,
    views: { images: 0, creas: 0, audios: 0, videos: 0 },
    upvotes: { images: 0, creas: 0, audios: 0, videos: 0 },
    createdAt: now,
  };
}

export const DEMO_TOPICS: Omit<Topic, '_id' | '_rev'>[] = [
  {
    type: 'topic',
    name: 'Mate Painting',
    slug: 'mate-painting',
    description: 'Peintures mates et textures naturelles.',
    createdAt: now,
  },
  {
    type: 'topic',
    name: 'Dessin',
    slug: 'dessin',
    description: 'Croquis, esquisses et dessins au crayon.',
    createdAt: now,
  },
  {
    type: 'topic',
    name: 'Illustration',
    slug: 'illustration',
    description: 'Illustrations numériques et traditionnelles.',
    createdAt: now,
  },
  {
    type: 'topic',
    name: 'Digital Painting',
    slug: 'digital-painting',
    description: 'Art numérique et peinture digitale.',
    createdAt: now,
  },
  {
    type: 'topic',
    name: 'Photographie',
    slug: 'photographie',
    description: 'Photos artistiques et reportages visuels.',
    createdAt: now,
  },
  {
    type: 'topic',
    name: 'Musique',
    slug: 'musique',
    description: 'Compositions, beats et créations sonores.',
    createdAt: now,
  },
  {
    type: 'topic',
    name: 'Vidéo',
    slug: 'video',
    description: 'Courts-métrages, clips et animations.',
    createdAt: now,
  },
  {
    type: 'topic',
    name: 'Animation',
    slug: 'animation',
    description: '2D, 3D et motion design.',
    createdAt: now,
  },
  {
    type: 'topic',
    name: 'Calligraphie',
    slug: 'calligraphie',
    description: 'Art de la belle écriture et du lettrage.',
    createdAt: now,
  },
  {
    type: 'topic',
    name: 'Sculpture',
    slug: 'sculpture',
    description: 'Modelage, gravure et formes en 3D.',
    createdAt: now,
  },
  {
    type: 'topic',
    name: 'Street Art',
    slug: 'street-art',
    description: 'Graffiti, murales et art urbain.',
    createdAt: now,
  },
];

const countries = [
  'Jamaica',
  'Kuwait',
  'Bermuda',
  'Ecuador',
  'Angola',
  'Mauritania',
  'Sri Lanka',
  'Namibia',
  'Samoa',
  'Eritrea',
  'Togo',
  'Romania',
  'Kenya',
  'Martinique',
  'Belize',
  'Chile',
  'Thailand',
  'Panama',
  'Malta',
  'Morocco',
  'Senegal',
  'Ghana',
  'Cameroon',
  'Madagascar',
];

const mediaTypes: MediaType[] = [
  MediaType.Image,
  MediaType.Image,
  MediaType.Image,
  MediaType.Video,
  MediaType.Audio,
  MediaType.Image,
];

export const DEMO_MEDIA: Omit<Media, '_id' | '_rev'>[] = countries.map(
  (country, i) => ({
    type: 'media' as const,
    mediaType: mediaTypes[i % mediaTypes.length],
    status: MediaStatus.Published,
    title: `${country} — Créativité locale`,
    description: `Découvrez les créations inspirées de ${country}. Une collection unique d'art et de culture.`,
    keywords: [country.toLowerCase(), 'art', 'creative', 'culture'],
    topics: [DEMO_TOPICS[i % DEMO_TOPICS.length].slug],
    author: {
      userId: 'demo-user',
      displayName: 'Tameri Artist',
      photoUrl: undefined,
    },
    storage: {
      key: `demo/media-${i + 1}.jpg`,
      bucket: 'tameri-bucket',
      originalName: `${country.toLowerCase().replace(/\s/g, '-')}.jpg`,
      mimeType: 'image/jpeg',
      size: 500000 + Math.floor(Math.random() * 500000),
    },
    urls: {
      original: `https://source.unsplash.com/800x600/?${encodeURIComponent(country)},art`,
      thumbnail: `https://source.unsplash.com/300x300/?${encodeURIComponent(country)},art`,
      preview: `https://source.unsplash.com/800x600/?${encodeURIComponent(country)},art`,
    },
    dimensions: { width: 800, height: 600 },
    metrics: {
      views: Math.floor(Math.random() * 500) + 10,
      upvotes: Math.floor(Math.random() * 50),
      downloads: Math.floor(Math.random() * 20),
    },
    price: undefined,
    createdAt: new Date(
      Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
    ).toISOString(),
  }),
);

export const DEMO_SEARCH_SUGGESTIONS: Omit<SearchSuggestion, '_id' | '_rev'>[] =
  [
    'photographie',
    'illustration',
    'peinture',
    'dessin',
    'musique',
    'art africain',
    'portrait',
    'paysage',
    'street art',
    'animation',
    'aquarelle',
    'sculpture',
    'calligraphie',
    'digital art',
    'nature',
  ].map((search) => ({
    type: 'search_suggestion' as const,
    search,
    searchType: SearchSuggestionType.Text,
    searchHash: Buffer.from(search).toString('base64'),
    useCount: Math.floor(Math.random() * 100) + 5,
    lastUsedAt: now,
    createdAt: now,
  }));
