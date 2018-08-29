import { Component, Input } from '@angular/core';
import { CardBrandType } from '../card-brand.enum';

@Component({
    selector: 'app-card-brand',
    templateUrl: './card-brand.component.html',
    styleUrls: ['./card-brand.component.scss']
})
export class CardBrandComponent {
    @Input() cardBrandString: string;
    @Input() cardBrandEnum: CardBrandType;
    cardBrandType = CardBrandType;
}
