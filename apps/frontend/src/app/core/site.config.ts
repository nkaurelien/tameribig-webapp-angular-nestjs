export const siteConfig = {
  name: 'Tameri',
  tagline: 'Plateforme de partage de médias créatifs',
  domain: 'tameribig.kamitbrains.fr',
  email: 'contact@tameribig.kamitbrains.fr',
  social: {
    facebook: 'https://facebook.com/tameribig',
    instagram: 'https://instagram.com/tameribig',
    twitter: 'https://twitter.com/tameribig',
    youtube: 'https://youtube.com/@tameribig',
    linkedin: '',
  },
  contact: {
    phone: '',
    whatsapp: '',
    address: 'Douala, Cameroun',
    hours: 'Lundi – Vendredi : 8h – 18h, Samedi : 9h – 15h',
  },
  legal: {
    companyName: 'KamitBrains',
    country: 'Cameroun',
    law: 'droit camerounais',
  },
  media: {
    maxFileSizeMb: 50,
    acceptedImages: ['image/jpeg', 'image/png', 'image/gif', 'image/webp'],
    acceptedVideos: ['video/mp4'],
    acceptedAudio: ['audio/mpeg', 'audio/wav'],
    currency: 'FCFA',
  },
} as const;
