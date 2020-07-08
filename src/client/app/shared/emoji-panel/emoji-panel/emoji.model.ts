export interface EmojiJsonFile {
    [key: string]: EmojiData;
}

export enum EmojiCategoryName {
    SEARCH = 'search',
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
        fully_qualified: string;
        decimal: string;
        default_matches: Array<string>;
        greedy_matches: Array<string>;
        diversity_parent: string;
        gender_parent: string;
    };
    display: number;
    diversity: Array<string>;
    diversities: Array<string>;
    diversity_base: number;
    gender: Array<string>;
    genders: Array<string>;
    keywords: Array<string>;
    name: string;
    order: number;
    shortname: string;
    shortname_alternates: Array<string>;
    unicode_version: number;
    humanform: number;
}
