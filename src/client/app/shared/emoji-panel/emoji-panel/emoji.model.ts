export interface EmojiJsonFile {
    [key: string]: EmojiData | any;
}

export enum EmojiCategoryName {
    PEOPLE = 'people',
    NATURE = 'nature',
    FOOD = 'food',
    ACTIVITY = 'activity',
    TRAVEL = 'travel',
    OBJECTS = 'objects',
    SYMBOLS = 'symbols',
    FLAGS = 'flags',
    REGIONAL = 'regional',
    MODIFIER = 'modifier',
}

export class EmojiCategory {
    emojiData: Array<{ key: string, value: EmojiData }> = [];

    constructor(public category: EmojiCategoryName) { }
}

export interface EmojiData {
    ascii: Array<string>;
    category: EmojiCategoryName;
    code_points: {
        base: string;
        decimal: string;
        fully_qualified: string;
        non_fully_qualified: string;
        output: string;
        default_matches: Array<string>;
        greedy_matches: Array<string>;
    };
    display: number;
    diversities: Array<string>;
    diversity: string;
    gender: string;
    genders: Array<string>;
    keywords: Array<string>;
    name: string;
    order: number;
    shortname: string;
    shortname_alternates: Array<string>;
    unicode_version: number;
}
