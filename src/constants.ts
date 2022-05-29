import { ArgumentConfig, ParseOptions, UsageGuideConfig } from 'ts-command-line-args';
import { IWordleSearchArgs } from './contracts';

export const defaultLength = 5;
export const defaultDisplayCount = 10;

export const wordleSearchArgConfig: ArgumentConfig<IWordleSearchArgs> = {
    known: {
        type: String,
        optional: true,
        defaultOption: true,
        description:
            'Known characters. Default option (does not need --known switch). Specify known characters: {highlight wordle-search k_o_n}',
    },
    length: {
        defaultValue: defaultLength,
        type: Number,
        alias: 'l',
        description: `Length of word to search for. Defaults to ${defaultLength}`,
    },
    exclude: { type: String, optional: true, alias: 'e', description: 'characters to exclude' },
    include: { type: String, optional: true, alias: 'i', description: 'characters to include' },
    maxDisplayCount: {
        defaultValue: defaultDisplayCount,
        type: Number,
        description: `Maximum results to display. Defaults to ${defaultDisplayCount}`,
    },
    help: { type: Boolean, alias: 'h' },
};

export const parseOptions: ParseOptions<IWordleSearchArgs> = {
    helpArg: 'help',
};

export const usageGuideInfo: UsageGuideConfig<IWordleSearchArgs> = {
    arguments: wordleSearchArgConfig,
    parseOptions,
};
