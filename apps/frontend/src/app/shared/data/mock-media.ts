import { PublicMedia, MediaType } from '../models/media.model';

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
  'Tokelau',
  'Belize',
  'Chile',
  'Thailand',
  'Myanmar',
  'Panama',
  'Malta',
  'Bahrain',
  'Somalia',
  'Morocco',
];

const types: MediaType[] = [
  MediaType.Image,
  MediaType.Image,
  MediaType.Image,
  MediaType.Video,
  MediaType.Audio,
  MediaType.Image,
];

export const MOCK_MEDIA: PublicMedia[] = countries.map((country, i) => ({
  _id: `mock-${i + 1}`,
  title: `${country} — Créativité locale`,
  description: `Découvrez les créations inspirées de ${country}.`,
  mediaType: types[i % types.length],
  keywords: [country.toLowerCase(), 'art', 'creative'],
  topics: [],
  author: {
    userId: `user-${(i % 5) + 1}`,
    displayName: 'Tameri Artist',
    photoUrl: undefined,
  },
  urls: {
    thumbnail: `https://source.unsplash.com/500x500/?${encodeURIComponent(country)},art`,
    preview: `https://source.unsplash.com/800x600/?${encodeURIComponent(country)},art`,
  },
  dimensions: { width: 500, height: 500 },
  metrics: {
    views: Math.floor(Math.random() * 500) + 10,
    upvotes: Math.floor(Math.random() * 50),
    downloads: Math.floor(Math.random() * 20),
  },
  price: undefined,
  createdAt: new Date(
    Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000,
  ).toISOString(),
}));
