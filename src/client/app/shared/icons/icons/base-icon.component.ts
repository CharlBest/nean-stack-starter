import { Directive, HostBinding, Input } from '@angular/core';

@Directive()
export abstract class BaseIconDirective {
    @Input() color?: 'primary' | 'accent' | 'warn';
    @Input() inline = false;

    @HostBinding('class.app-icon') appIcon = true;

    @HostBinding('class.inline') get isInline(): boolean {
        return this.inline;
    }
    @HostBinding('class.primary') get isPrimary(): boolean {
        return this.color === 'primary';
    }
    @HostBinding('class.accent') get isAccent(): boolean {
        return this.color === 'accent';
    }
    @HostBinding('class.warn') get isWarning(): boolean {
        return this.color === 'warn';
    }
}
