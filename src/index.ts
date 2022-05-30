#!/usr/bin/env node

import { parse } from 'ts-command-line-args';
import { parseOptions, wordleSearchArgConfig } from './constants';
import { IWordleSearchArgs } from './contracts';
import { readFile } from 'fs/promises';
import { join } from 'path';

type FilterOptions = {
    length: number;
    knownCharacters?: (string | undefined)[];
    include?: string;
    includeCharacters?: string[];
    excludeRegexp?: RegExp;
};

const characterRegExp = /[a-z]/;

async function wordleSearch() {
    const args = parse<IWordleSearchArgs>(wordleSearchArgConfig, parseOptions);

    let excludeRegexp: RegExp | undefined;
    let includeCharacters: string[] | undefined;
    let knownCharacters: (string | undefined)[] | undefined;

    console.log(`Search for ${args.length} letter words:`);
    if (args.include != null) {
        includeCharacters = Array.from(args.include.toLowerCase());
        console.log(`MUST include the letters ${printCharacters(args.include)}`);
    }
    if (args.exclude != null) {
        excludeRegexp = RegExp(`^[^${args.exclude.toLowerCase()}]*$`);
        console.log(`MUST NOT include the letters ${printCharacters(args.exclude)}`);
    }
    if (args.known != null) {
        const lowerCase = args.known.toLowerCase();
        knownCharacters = Array.from(lowerCase).map((character) =>
            characterRegExp.test(character) ? character : undefined
        );
        console.log(
            `With known characters: "${knownCharacters
                .map((character) => (character != null ? character.toUpperCase() : '_'))
                .join(' ')}"`
        );
    }

    console.log(' ');

    const wordList = await readFile(join(__dirname, '../dictionary/words.txt'));
    const words = wordList.toString().split('\r\n');

    const matchedWords = words.filter((word) =>
        filterWord(word, { length: args.length, excludeRegexp, includeCharacters, knownCharacters })
    );

    const displayCountMessage =
        matchedWords.length > args.maxDisplayCount ? ` (Only displaying first ${args.maxDisplayCount})` : '';

    console.log(`${matchedWords.length} results found${displayCountMessage}:`);

    matchedWords.slice(0, args.maxDisplayCount).forEach((word) => console.log(word));
}

wordleSearch();

function printCharacters(characters: string): string {
    return Array.from(characters.toUpperCase())
        .map((char) => `'${char}'`)
        .join(', ');
}

function filterWord(word: string, options: FilterOptions): boolean {
    if (word.length != options.length) {
        return false;
    }

    if (
        options.includeCharacters != null &&
        !options.includeCharacters.every((character) => word.indexOf(character) >= 0)
    ) {
        return false;
    }
    if (options.excludeRegexp != null && !options.excludeRegexp.test(word)) {
        return false;
    }
    if (
        options.knownCharacters != null &&
        !options.knownCharacters.every((character, index) => character == null || word.charAt(index) === character)
    ) {
        return false;
    }

    return true;
}
