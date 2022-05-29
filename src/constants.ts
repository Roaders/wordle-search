import { ArgumentConfig, ParseOptions } from "ts-command-line-args";
import { IWordleSearchArgs } from "./contracts";

export const defaultLength = 5;

export const wordleSearchArgConfig: ArgumentConfig<IWordleSearchArgs> = {
    known: {type: String, optional: true, defaultOption: true, description: "Known characters. Default option (does not need --known switch). Specify known characters: {highlight wordle-search k_o_n}"},
    length: {defaultValue: defaultLength, type: Number, alias: "l", description: `Length of word to search for. Defaults to ${defaultLength}`},
    exclude: {type: String, optional: true, alias: "e", description: "characters to exclude"},
    include: {type: String, optional: true, alias: "i", description: "characters to include"},
    help: {type: Boolean, alias:"h"},
}

export const argsOptions: ParseOptions<IWordleSearchArgs> = {
    helpArg: "help"
}