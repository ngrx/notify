import { NotificationInstance } from '../lib/notification';
import 'rxjs/add/operator/take';
import 'rxjs/add/observable/of';
import { Observable } from 'rxjs/Observable';

import { Notify } from '../lib/notify';

describe('Notify', function() {
  it('should alias "requestPermission()" to "NotificationPermission"', function(done) {
    const notify = new Notify(<any>{}, {}, Observable.of(true));

    notify.requestPermission().subscribe({
      next(permission) {
        expect(permission).toBe(true);
      },
      error: done,
      complete: done
    });
  });

  it('should not create a notification observable if it does not have permission', function(done) {
    const Notification = jasmine.createSpy('Notification');
    const notify = new Notify(<any>Notification, {}, Observable.of(false));

    notify.open('test').subscribe({
      error(err) {
        expect(err).toBeDefined();
        expect(Notification).not.toHaveBeenCalled();
        done();
      },
      complete() {
        expect(false).toBe(true);
        done();
      }
    });
  });

  it('should create a notification if it has permission', function() {
    const Notification = jasmine.createSpy('Notification').and.returnValue({
      close: () => {}
    });

    const notify = new Notify(<any>Notification, {}, Observable.of(true));
    const sub = notify.open('test').subscribe();

    expect(Notification).toHaveBeenCalledWith('test', {});
    sub.unsubscribe();
  });

  it('should close the notification when the observable is unsubscribed from', function() {
    const close = jasmine.createSpy('close');
    const Notification = jasmine.createSpy('Notification').and.returnValue({ close });
    const notify = new Notify(<any>Notification, {}, Observable.of(true));
    const sub = notify.open('test').subscribe();
    sub.unsubscribe();

    expect(close).toHaveBeenCalled();
  });

  it('should emit the notification instance everytime the notification "onclick" handler is called', function(done) {
    const instance = {
      set onclick(val) {
        val();
      },
      close: () => {}
    }  as NotificationInstance;

    const Notification = jasmine.createSpy('Notification').and.returnValue(instance);
    const notify = new Notify(<any>Notification, {}, Observable.of(true));

    notify.open('something').take(1).subscribe({
      next(val) {
        expect(val).toBe(instance);
      },
      error: done,
      complete: done
    });
  });

  it('should error with the notification instance when the "onerror" handler is called', function(done) {
    const instance = {
      set onerror(val) {
        val();
      },
      close: () => {}
    };

    const Notification = jasmine.createSpy('Notification').and.returnValue(instance);
    const notify = new Notify(<any>Notification, {}, Observable.of(true));

    notify.open('something').subscribe({
      error(err) {
        expect(err).toBe(instance);
        done();
      }
    });
  });

  it('should complete the observable when the "onclose" handler is called', function(done) {
    const instance = {
      set onclose(val) {
        val();
      },
      close: () => {}
    };

    const Notification = jasmine.createSpy('Notification').and.returnValue(instance);
    const notify = new Notify(<any>Notification, {}, Observable.of(true));

    notify.open('something').subscribe({
      complete: () => {
        expect(true).toBe(true);
        done();
      }
    });
  });

  it('should complete the observable if you call the close method on the instance', function(done) {
    // todo: Rewrite this test using the observable test helpers
    const close = jasmine.createSpy('close');
    const instance = {
      set onclick(val) {
        val();
      },
      close
    };

    const Notification = jasmine.createSpy('Notification').and.returnValue(instance);
    const notify = new Notify(<any>Notification, {}, Observable.of(true));

    const sub = notify.open('test').subscribe({
      next(val) {
        val.close();
      },
      error: done,
      complete() {
        expect(close).toHaveBeenCalled();
        done();
      }
    });
  });
});
