import { InjectionToken, ModuleWithProviders, NgModule } from '@angular/core';

import { Notify } from './notify';
import { NotificationStatic, NotificationOptions } from './notification';
import { NotificationPermission } from './notification-permission';

declare const window: any;
export declare var Notification: NotificationStatic;

export const NOTIFY_GLOBAL_OPTIONS = new InjectionToken<NotificationOptions>('[@ngrx/notify] Global Options');
export const NOTIFICATION_STATIC = new InjectionToken<NotificationStatic>('[@ngrx/notify] Notification Static Constructor');

export function createNotification(): NotificationStatic {
  return window.Notification;
}

export function createNotificationPermission(notification: NotificationStatic): NotificationPermission {
  return new NotificationPermission(notification);
}

export function createNotify(notification: NotificationStatic, options: NotificationOptions, permission$: NotificationPermission): Notify {
  return new Notify(notification, options, permission$);
}

@NgModule({
})
export class NotifyModule {
  static forRoot(options: NotificationOptions = {}): ModuleWithProviders {
    return {
      ngModule: NotifyModule,
      providers: [
        {
          provide: NOTIFICATION_STATIC,
          useFactory: (createNotification)
        },
        {
          provide: NotificationPermission,
          deps: [NOTIFICATION_STATIC],
          useFactory: (createNotificationPermission)
        },
        {
          provide: NOTIFY_GLOBAL_OPTIONS,
          useValue: options
        },
        {
          provide: Notify,
          deps: [
            NOTIFICATION_STATIC,
            NOTIFY_GLOBAL_OPTIONS,
            NotificationPermission
          ],
          useFactory: (createNotify)
        }
      ]
    };
  }
}
