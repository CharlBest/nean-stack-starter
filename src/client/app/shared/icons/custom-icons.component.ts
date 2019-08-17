import { Component } from '@angular/core';
import { BaseIconComponent } from './base-icon.component';

export function customIconPath(iconName: string) {
  return `../../../assets/icons/${iconName}.svg`;
}

@Component({
  selector: 'app-icon-applepay',
  templateUrl: customIconPath('applepay')
})
export class IconApplePayComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-blogger',
  templateUrl: customIconPath('blogger')
})
export class IconBloggerComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-facebook',
  templateUrl: customIconPath('facebook')
})
export class IconFacebookComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-googlepay',
  templateUrl: customIconPath('googlepay')
})
export class IconGooglePayComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-linkedin',
  templateUrl: customIconPath('linkedin')
})
export class IconLinkedInComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-messenger',
  templateUrl: customIconPath('messenger')
})
export class IconMessengerComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-mix',
  templateUrl: customIconPath('mix')
})
export class IconMixComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-paypal',
  templateUrl: customIconPath('paypal')
})
export class IconPayPalComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-pinterest',
  templateUrl: customIconPath('pinterest')
})
export class IconPinterestComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-reddit',
  templateUrl: customIconPath('reddit')
})
export class IconRedditComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-tumblr',
  templateUrl: customIconPath('tumblr')
})
export class IconTumblrComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-twitter',
  templateUrl: customIconPath('twitter')
})
export class IconTwitterComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-wechat',
  templateUrl: customIconPath('wechat')
})
export class IconWeChatComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-whatsapp',
  templateUrl: customIconPath('whatsapp')
})
export class IconWhatsAppComponent extends BaseIconComponent { }
