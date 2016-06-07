import { Observable } from 'rxjs/Observable';
import { Subscriber } from 'rxjs/Subscriber';

import { NotificationStatic } from './notification';

export class NotificationPermission extends Observable<boolean> {
  constructor(notification?: NotificationStatic) {
    super((subscriber: Subscriber<boolean>) => {
      if (!notification || notification.permission === 'denied') {
        subscriber.next(false);
        subscriber.complete();
      }
      else if (notification.permission === 'granted') {
        subscriber.next(true);
        subscriber.complete();
      }
      else {
        notification.requestPermission().then(permission => {
          subscriber.next(permission === 'granted');
          subscriber.complete();
        });
      }
    });
  }
}
