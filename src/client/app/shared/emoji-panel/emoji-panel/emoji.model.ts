export class EmojiCategory {
    category: string;
    tabLabelText: string;
    tabLabelIcon: string;
    emojiData: Array<{ key: string, value: EmojiData }>;

    constructor(category: string, tabLabelText: string, tabLabelIcon: string) {
        this.category = category;
        this.tabLabelText = tabLabelText;
        this.tabLabelIcon = tabLabelIcon;
        this.emojiData = [];
    }
}

export interface EmojiData {
    ascii: Array<string>;
    category: string;
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
