import { Component } from '@angular/core';
import { Category } from '../material-icon-category.model';
import { BaseIconComponent } from './base-icon.component';

export function materialIconPath(iconName: string, category: string = Category.ACTION) {
  return `../../../../../../node_modules/material-design-icons/${category}/svg/production/ic_${iconName}_24px.svg`;
}

@Component({
  selector: 'app-icon-home',
  templateUrl: materialIconPath('home')
})
export class IconHomeComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-lock',
  templateUrl: materialIconPath('lock')
})
export class IconLockComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-fiber-manual-record',
  templateUrl: materialIconPath('fiber_manual_record', Category.AV)
})
export class IconFiberManualRecordComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-star',
  templateUrl: materialIconPath('star', Category.TOGGLE)
})
export class IconStarComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-account-circle',
  templateUrl: materialIconPath('account_circle')
})
export class IconAccountCircleComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-notifications',
  templateUrl: materialIconPath('notifications', Category.SOCIAL)
})
export class IconNotificationsComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-credit-card',
  templateUrl: materialIconPath('credit_card')
})
export class IconCreditCardComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-feedback',
  templateUrl: materialIconPath('feedback')
})
export class IconFeedbackComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-group-add',
  templateUrl: materialIconPath('group_add', Category.SOCIAL)
})
export class IconGroupAddComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-mail',
  templateUrl: materialIconPath('mail', Category.CONTENT)
})
export class IconMailComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-live-help',
  templateUrl: materialIconPath('live_help', Category.COMMUNICATION)
})
export class IconLiveHelpComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-help',
  templateUrl: materialIconPath('help')
})
export class IconHelpComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-code',
  templateUrl: materialIconPath('code')
})
export class IconCodeComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-exit-to-app',
  templateUrl: materialIconPath('exit_to_app')
})
export class IconExitToAppComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-brightness-2',
  templateUrl: materialIconPath('brightness_2', Category.IMAGE)
})
export class IconBrightness2Component extends BaseIconComponent { }

@Component({
  selector: 'app-icon-brightness-5',
  templateUrl: materialIconPath('brightness_5', Category.IMAGE)
})
export class IconBrightness5Component extends BaseIconComponent { }

@Component({
  selector: 'app-icon-notifications-active',
  templateUrl: materialIconPath('notifications_active', Category.SOCIAL)
})
export class IconNotificationActiveComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-close',
  templateUrl: materialIconPath('close', Category.NAVIGATION)
})
export class IconCloseComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-cancel',
  templateUrl: materialIconPath('cancel', Category.NAVIGATION)
})
export class IconCancelComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-done',
  templateUrl: materialIconPath('done')
})
export class IconDoneComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-link',
  templateUrl: materialIconPath('link', Category.CONTENT)
})
export class IconLinkComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-share',
  templateUrl: materialIconPath('share', Category.SOCIAL)
})
export class IconShareComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-edit',
  templateUrl: materialIconPath('edit', Category.IMAGE)
})
export class IconEditComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-delete',
  templateUrl: materialIconPath('delete')
})
export class IconDeleteComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-report',
  templateUrl: materialIconPath('report', Category.CONTENT)
})
export class IconReportComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-more-vert',
  templateUrl: materialIconPath('more_vert', Category.NAVIGATION)
})
export class IconMoreVertComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-keyboard-arrow-left',
  templateUrl: materialIconPath('keyboard_arrow_left', Category.HARDWARE)
})
export class IconKeyboardArrowLeftComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-keyboard-arrow-right',
  templateUrl: materialIconPath('keyboard_arrow_right', Category.HARDWARE)
})
export class IconKeyboardArrowRightComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-mode-comment',
  templateUrl: materialIconPath('mode_comment', Category.EDITOR)
})
export class IconModeCommentComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-info',
  templateUrl: materialIconPath('info')
})
export class IconInfoComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-check-circle',
  templateUrl: materialIconPath('check_circle')
})
export class IconCheckCircleComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-graphic-eq',
  templateUrl: materialIconPath('graphic_eq', Category.DEVICE)
})
export class IconGraphicEqComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-tag-faces',
  templateUrl: materialIconPath('tag_faces', Category.IMAGE)
})
export class IconTagFaceComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-arrow-back',
  templateUrl: materialIconPath('arrow_back', Category.NAVIGATION)
})
export class IconArrowBackComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-search',
  templateUrl: materialIconPath('search')
})
export class IconSearchComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-person',
  templateUrl: materialIconPath('person', Category.SOCIAL)
})
export class IconPersonComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-airplanemode-active',
  templateUrl: materialIconPath('airplanemode_active', Category.DEVICE)
})
export class IconAirplaneModeActiveComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-arrow-upward',
  templateUrl: materialIconPath('arrow_upward', Category.NAVIGATION)
})
export class IconArrowUpwardComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-error-outline',
  templateUrl: materialIconPath('error_outline', Category.ALERT)
})
export class IconErrorOutlineComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-pets',
  templateUrl: materialIconPath('pets')
})
export class IconPetsComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-free-breakfast',
  templateUrl: materialIconPath('free_breakfast', Category.PLACES)
})
export class IconFreeBreakfastComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-beach-access',
  templateUrl: materialIconPath('beach_access', Category.PLACES)
})
export class IconBeachAccessComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-directions-car',
  templateUrl: materialIconPath('directions_car', Category.MAPS)
})
export class IconDirectionsCarComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-lightbulb-outline',
  templateUrl: materialIconPath('lightbulb_outline')
})
export class IconLightbulbOutlineComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-priority-high',
  templateUrl: materialIconPath('priority_high', Category.NOTIFICATION)
})
export class IconPriorityHighComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-flag',
  templateUrl: materialIconPath('flag', Category.CONTENT)
})
export class IconFlagComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-email',
  templateUrl: materialIconPath('email', Category.COMMUNICATION)
})
export class IconEmailComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-arrow-drop-down',
  templateUrl: materialIconPath('arrow_drop_down', Category.NAVIGATION)
})
export class IconArrowDropDownComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-arrow-drop-up',
  templateUrl: materialIconPath('arrow_drop_up', Category.NAVIGATION)
})
export class IconArrowDropUpComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-visibility',
  templateUrl: materialIconPath('visibility', Category.ACTION)
})
export class IconVisibilityComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-visibility-off',
  templateUrl: materialIconPath('visibility_off', Category.ACTION)
})
export class IconVisibilityOffComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-translate',
  templateUrl: materialIconPath('translate', Category.ACTION)
})
export class IconTranslateComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-change-history',
  templateUrl: materialIconPath('change_history', Category.ACTION)
})
export class IconChangeHistoryComponent extends BaseIconComponent { }

@Component({
  selector: 'app-icon-verified-user',
  templateUrl: materialIconPath('verified_user', Category.ACTION)
})
export class IconVerifiedUserComponent extends BaseIconComponent { }
