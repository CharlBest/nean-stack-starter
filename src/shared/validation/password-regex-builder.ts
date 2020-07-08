export class PasswordRegexBuilder {
    private regex = '';

    constructor(private minLength?: number, private maxLength = 100) { }

    oneUpperCase(): this {
        this.regex += '(?=.*?[A-Z])';
        return this;
    }

    oneLowerCase(): this {
        this.regex += '(?=.*?[a-z])';
        return this;
    }

    oneDigit(): this {
        this.regex += '(?=.*?[0-9])';
        return this;
    }

    oneSpecialCharacter(): this {
        this.regex += '(?=.*?[#?!@$%^&*-])';
        return this;
    }

    get value(): RegExp {
        return new RegExp(`^${this.regex}.{${this.minLength || 0},${this.maxLength}}$`);
    }
}
