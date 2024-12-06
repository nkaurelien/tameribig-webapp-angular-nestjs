/* tslint:disable:no-var-requires no-console */

const Sentiment = require('sentiment');

const sentiment = new Sentiment();

import {frLanguage} from './language';

sentiment.registerLanguage('fr', frLanguage);

const option = {
    language: 'fr',
};

export function sentimentAnalyze(text: string) {
    const result = sentiment.analyze(text, option);
    // console.dir(result);
    return result;
}
