import { OpaqueToken } from '@angular/core';

import { Notify } from './notify';
import { NotificationStatic, NotificationOptions } from './notification';
import { NotificationPermission } from './notification-permission';

declare var Notification: NotificationStatic;

export const NOTIFY_GLOBAL_OPTIONS = new OpaqueToken('[@ngrx/notify] Global Options');
export const NOTIFICATION_STATIC = new OpaqueToken('[@ngrx/notify] Notification Static Constructor');


const NOTIFICATION_STATIC_PROVIDER = {
  provide: NOTIFICATION_STATIC,
  useValue: Notification
};

const NOTIFICATION_PERMISSION_PROVIDER = {
  provide: NotificationPermission,
  deps: [ NOTIFICATION_STATIC ],
  useFactory(Notification: NotificationStatic) {
    return new NotificationPermission(Notification);
  }
};

const NOTIFY_PROVIDER = {
  provide: Notify,
  deps: [ NOTIFICATION_STATIC, NOTIFY_GLOBAL_OPTIONS, NotificationPermission ],
  useFactory(Notification: NotificationStatic, options: NotificationOptions[], permission$: NotificationPermission) {
    return new Notify(Notification, options, permission$);
  }
};

const DEFAULT_GLOBAL_OPTIONS_PROVIDER = {
  provide: NOTIFY_GLOBAL_OPTIONS,
  multi: true,
  useValue: {}
};

export const NOTIFY_PROVIDERS: any[] = [
  NOTIFICATION_STATIC_PROVIDER,
  NOTIFICATION_PERMISSION_PROVIDER,
  NOTIFY_PROVIDER,
  DEFAULT_GLOBAL_OPTIONS_PROVIDER
];
