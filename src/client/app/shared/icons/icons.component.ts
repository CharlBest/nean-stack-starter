import { Component, HostBinding, Input } from '@angular/core';
import { Category } from './icon-category.model';

export function svg(iconName: string, category: string = Category.ACTION) {
  return `../../../../../node_modules/material-design-icons/${category}/svg/production/ic_${iconName}_24px.svg`;
}

export class BaseIconComponent {
  @Input() color: 'primary' | 'accent' | 'warn';
  @Input() inline = false;

  @HostBinding('class.app-icon') get appIcon() {
    return true;
  }

  @HostBinding('class.primary') get isPrimary() {
    return this.color === 'primary';
  }

  @HostBinding('class.accent') get isAccent() {
    return this.color === 'accent';
  }

  @HostBinding('class.warn') get isWarning() {
    return this.color === 'warn';
  }
}

@Component({
  selector: 'app-icon-home',
  templateUrl: svg('home')
})
export class IconHomeComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-lock',
  templateUrl: svg('lock')
})
export class IconLockComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-fiber-manual-record',
  templateUrl: svg('fiber_manual_record', Category.AV)
})
export class IconFiberManualRecordComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-star',
  templateUrl: svg('star', Category.TOGGLE)
})
export class IconStarComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-account-circle',
  templateUrl: svg('account_circle')
})
export class IconAccountCircleComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-notifications',
  templateUrl: svg('notifications', Category.SOCIAL)
})
export class IconNotificationsComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-credit-card',
  templateUrl: svg('credit_card')
})
export class IconCreditCardComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-feedback',
  templateUrl: svg('feedback')
})
export class IconFeedbackComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-group-add',
  templateUrl: svg('group_add', Category.SOCIAL)
})
export class IconGroupAddComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-mail',
  templateUrl: svg('mail', Category.CONTENT)
})
export class IconMailComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-live-help',
  templateUrl: svg('live_help', Category.COMMUNICATION)
})
export class IconLiveHelpComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-help',
  templateUrl: svg('help')
})
export class IconHelpComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-code',
  templateUrl: svg('code')
})
export class IconCodeComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-exit-to-app',
  templateUrl: svg('exit_to_app')
})
export class IconExitToAppComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-brightness-2',
  templateUrl: svg('brightness_2', Category.IMAGE)
})
export class IconBrightness2Component extends BaseIconComponent { }

@Component({
  selector: 'app-icon-brightness-5',
  templateUrl: svg('brightness_5', Category.IMAGE)
})
export class IconBrightness5Component extends BaseIconComponent { }

@Component({
  selector: 'app-icon-notifications-active',
  templateUrl: svg('notifications_active', Category.SOCIAL)
})
export class IconNotificationActiveComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-close',
  templateUrl: svg('close', Category.NAVIGATION)
})
export class IconCloseComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-cancel',
  templateUrl: svg('cancel', Category.NAVIGATION)
})
export class IconCancelComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-done',
  templateUrl: svg('done')
})
export class IconDoneComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-link',
  templateUrl: svg('link', Category.CONTENT)
})
export class IconLinkComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-share',
  templateUrl: svg('share', Category.SOCIAL)
})
export class IconShareComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-edit',
  templateUrl: svg('edit', Category.IMAGE)
})
export class IconEditComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-delete',
  templateUrl: svg('delete')
})
export class IconDeleteComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-report',
  templateUrl: svg('report', Category.CONTENT)
})
export class IconReportComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-more-vert',
  templateUrl: svg('more_vert', Category.NAVIGATION)
})
export class IconMoreVertComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-keyboard-arrow-left',
  templateUrl: svg('keyboard_arrow_left', Category.HARDWARE)
})
export class IconKeyboardArrowLeftComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-keyboard-arrow-right',
  templateUrl: svg('keyboard_arrow_right', Category.HARDWARE)
})
export class IconKeyboardArrowRightComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-mode-comment',
  templateUrl: svg('mode_comment', Category.EDITOR)
})
export class IconModeCommentComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-info',
  templateUrl: svg('info')
})
export class IconInfoComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-check-circle',
  templateUrl: svg('check_circle')
})
export class IconCheckCircleComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-graphic-eq',
  templateUrl: svg('graphic_eq', Category.DEVICE)
})
export class IconGraphicEqComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-tag-faces',
  templateUrl: svg('tag_faces', Category.IMAGE)
})
export class IconTagFaceComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-arrow-back',
  templateUrl: svg('arrow_back', Category.NAVIGATION)
})
export class IconArrowBackComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-search',
  templateUrl: svg('search')
})
export class IconSearchComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-person',
  templateUrl: svg('person', Category.SOCIAL)
})
export class IconPersonComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-airplanemode-active',
  templateUrl: svg('airplanemode_active', Category.DEVICE)
})
export class IconAirplaneModeActiveComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-arrow-upward',
  templateUrl: svg('arrow_upward', Category.NAVIGATION)
})
export class IconArrowUpwardComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-error-outline',
  templateUrl: svg('error_outline', Category.ALERT)
})
export class IconErrorOutlineComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-pets',
  templateUrl: svg('pets')
})
export class IconPetsComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-free-breakfast',
  templateUrl: svg('free_breakfast', Category.PLACES)
})
export class IconFreeBreakfastComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-beach-access',
  templateUrl: svg('beach_access', Category.PLACES)
})
export class IconBeachAccessComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-directions-car',
  templateUrl: svg('directions_car', Category.MAPS)
})
export class IconDirectionsCarComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-lightbulb-outline',
  templateUrl: svg('lightbulb_outline')
})
export class IconLightbulbOutlineComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-priority-high',
  templateUrl: svg('priority_high', Category.NOTIFICATION)
})
export class IconPriorityHighComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-flag',
  templateUrl: svg('flag', Category.CONTENT)
})
export class IconFlagComponent extends BaseIconComponent { }
