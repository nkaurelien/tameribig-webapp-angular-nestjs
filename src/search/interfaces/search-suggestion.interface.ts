import { MaybeDocument } from 'nano';

export enum SearchSuggestionType {
  Text = 'text',
  Image = 'image',
  Creation = 'creation',
  Video = 'video',
  Audio = 'audio',
}

export interface SearchSuggestion extends MaybeDocument {
  type: 'search_suggestion';
  search: string;
  searchType: SearchSuggestionType;
  searchHash: string;
  useCount: number;
  lastUsedAt: string;
  createdAt: string;
}
