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

    const wordlist = await readFile(join(__dirname, '../dictionary/words.txt'));
    const words = wordlist.toString().split('\r\n');

    const excludeRegexp = args.exclude != null ? new RegExp(`^[^${args.exclude}]*$`) : undefined;
    const includeCharacters = args.include != null ? Array.from(args.include) : undefined;
    const knownCharacters =
        args.known != null
            ? Array.from(args.known.toLowerCase()).map((character) =>
                  characterRegExp.test(character) ? character : undefined
              )
            : undefined;

    const matchedWords = words.filter((word) =>
        filterWord(word, { length: args.length, excludeRegexp, includeCharacters, knownCharacters })
    );

    console.log({ ...args, words: words.length, matches: matchedWords.length, knownCharacters });

    matchedWords.forEach((word) => console.log(word));
}

wordleSearch();

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
