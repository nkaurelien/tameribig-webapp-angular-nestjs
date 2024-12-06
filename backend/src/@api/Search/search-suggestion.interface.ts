import {Document} from 'mongoose';

export enum SearchSuggestionType {
    Text = 'text',
    Image = 'image',
    Creation = 'creation',
    Video = 'video',
    Audio = 'audio',
}

export interface SearchSuggestion extends Document {

    readonly useCount?: number;
    readonly search: string;
    readonly type: SearchSuggestionType;
    readonly searchMd5: string;
    readonly results?: any[];
    readonly lastUsedAt: string;

}
