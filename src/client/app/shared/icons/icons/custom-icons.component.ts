import { Component } from '@angular/core';
import { BaseIconDirective } from './base-icon.component';

export function customIconPath(iconName: string) {
  return `../../../../assets/icons/${iconName}.svg`;
}

@Component({
  selector: 'app-icon-apple-pay',
  templateUrl: customIconPath('applepay')
})
export class IconApplePayComponent extends BaseIconDirective { }

@Component({
  selector: 'app-icon-blogger',
  templateUrl: customIconPath('blogger')
})
export class IconBloggerComponent extends BaseIconDirective { }

@Component({
  selector: 'app-icon-facebook',
  templateUrl: customIconPath('facebook')
})
export class IconFacebookComponent extends BaseIconDirective { }

@Component({
  selector: 'app-icon-google-pay',
  templateUrl: customIconPath('googlepay')
})
export class IconGooglePayComponent extends BaseIconDirective { }

@Component({
  selector: 'app-icon-linkedin',
  templateUrl: customIconPath('linkedin')
})
export class IconLinkedInComponent extends BaseIconDirective { }

@Component({
  selector: 'app-icon-messenger',
  templateUrl: customIconPath('messenger')
})
export class IconMessengerComponent extends BaseIconDirective { }

@Component({
  selector: 'app-icon-mix',
  templateUrl: customIconPath('mix')
})
export class IconMixComponent extends BaseIconDirective { }

@Component({
  selector: 'app-icon-paypal',
  templateUrl: customIconPath('paypal')
})
export class IconPayPalComponent extends BaseIconDirective { }

@Component({
  selector: 'app-icon-pinterest',
  templateUrl: customIconPath('pinterest')
})
export class IconPinterestComponent extends BaseIconDirective { }

@Component({
  selector: 'app-icon-reddit',
  templateUrl: customIconPath('reddit')
})
export class IconRedditComponent extends BaseIconDirective { }

@Component({
  selector: 'app-icon-tumblr',
  templateUrl: customIconPath('tumblr')
})
export class IconTumblrComponent extends BaseIconDirective { }

@Component({
  selector: 'app-icon-twitter',
  templateUrl: customIconPath('twitter')
})
export class IconTwitterComponent extends BaseIconDirective { }

@Component({
  selector: 'app-icon-wechat',
  templateUrl: customIconPath('wechat')
})
export class IconWeChatComponent extends BaseIconDirective { }

@Component({
  selector: 'app-icon-whatsapp',
  templateUrl: customIconPath('whatsapp')
})
export class IconWhatsAppComponent extends BaseIconDirective { }
