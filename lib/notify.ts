import 'rxjs/add/observable/throw';
import 'rxjs/add/operator/mergeMap';
import 'rxjs/add/operator/share';
import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';
import { NotificationStatic, NotificationOptions, NotificationInstance } from './notification';

export class Notify {
  private _permission$: Observable<boolean>;

  constructor(
    private notificationConstructor: NotificationStatic,
    private globalOptions: NotificationOptions,
    permission$: Observable<boolean>
  ) {
    this._permission$ = permission$.share();
  }

  requestPermission(): Observable<boolean> {
    return this._permission$;
  }

  private _createNotificationObservable(title: string, _options?: NotificationOptions) {
    const options: NotificationOptions = { ...this.globalOptions, ..._options };

    return new Observable((subscriber: Subscriber<NotificationInstance>) => {
      const notification = new this.notificationConstructor(title, options);
      const CLOSE_NOTIFICATION = notification.close.bind(notification);

      notification.close = () => { CLOSE_NOTIFICATION(); subscriber.complete(); };
      notification.onclick = () => subscriber.next(notification);
      notification.onerror = () => subscriber.error(notification);
      notification.onclose = () => subscriber.complete();

      return CLOSE_NOTIFICATION;
    });
  }

  open(title: string, options?: NotificationOptions): Observable<NotificationInstance> {
    return this.requestPermission().mergeMap(permission => {
      if (!permission) {
        return Observable.throw(new Error(
          'Permission Denied: You do not have permission to open a notification.'
        ));
      }

      return this._createNotificationObservable(title, options);
    });
  }
}
