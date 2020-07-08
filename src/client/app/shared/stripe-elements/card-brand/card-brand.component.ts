import { Component, Input, OnInit } from '@angular/core';
import { CardBrandType } from '../card-brand.enum';

@Component({
    selector: 'app-card-brand',
    templateUrl: './card-brand.component.html',
    styleUrls: ['./card-brand.component.scss']
})
export class CardBrandComponent implements OnInit {
    @Input() cardBrandString: string;
    @Input() cardBrandEnum: CardBrandType;
    cardBrandType = CardBrandType;

    ngOnInit(): void {
        if (this.cardBrandString) {
            this.cardBrandString = this.cardBrandString.toUpperCase();
        }
    }
}
