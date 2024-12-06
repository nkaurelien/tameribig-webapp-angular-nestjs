/* tslint:disable:object-literal-key-quotes */
import mongoose from 'mongoose';

export const SearchSuggestionSchema = new mongoose.Schema(
    {
        search: {
            type: String,
            required: true,
        },
        type: {
            type: String,
            required: false,
        },
        searchMd5: {
            type: String,
            required: true,
        },
        useCount: {
            type: Number,
            required: false,
        },
        results: {
            type: Array,
            required: false,
        },
        lastUsedAt: {
            type: String,
            required: false,
        },
        createdAt: {
            type: String,
            required: false,
        },

    },
    {timestamps: true},
);

// To create an index to support text search
SearchSuggestionSchema.index({'search': 'text'});
// Or if you want to include all string fields in the index, use the '$**' wildcard:
// SearchSuggestionSchema.index({'$**': 'text'});
