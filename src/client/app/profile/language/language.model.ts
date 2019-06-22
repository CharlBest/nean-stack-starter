export class Language {
    code: string;
    title: string;

    constructor(code: 'en-US' | 'af-ZA', title: string) {
        this.code = code;
        this.title = title;
    }
}
