import { NotificationPermission } from '../lib/notification-permission';
import { NotificationPermissionStatus } from '../lib/notification';

describe('Notification Permission', function() {
  it('should complete with a denied status if there is not Notification support', function(done) {
    new NotificationPermission().subscribe({
      next(permission) {
        expect(permission).toBe(false);
      },
      error: done,
      complete: done
    });
  });

  it('should complete with a denied status if the permission type is "denied"', function(done) {
    const permission: NotificationPermissionStatus = 'denied';
    const notification: any = { permission };

    new NotificationPermission(notification).subscribe({
      next(permission) {
        expect(permission).toBe(false);
      },
      error: done,
      complete: done
    });
  });

  it('should complete with a granted status if the permission type is "granted"', function(done) {
    const permission: NotificationPermissionStatus = 'granted';
    const notification: any = { permission };

    new NotificationPermission(notification).subscribe({
      next(permission) {
        expect(permission).toBe(true);
      },
      error: done,
      complete: done
    });
  });

  it('should request permission if the permission type is "default"', function(done) {
    const permission: NotificationPermissionStatus = 'default';
    const resolvedPermission: Promise<NotificationPermissionStatus> = Promise.resolve('granted');
    const requestPermission = jasmine.createSpy('requestPermission').and.returnValue(resolvedPermission);
    const notification: any = { permission, requestPermission };

    new NotificationPermission(notification).subscribe({
      next(permission) {
        expect(permission).toBe(true);
        expect(requestPermission).toHaveBeenCalled();
      },
      error: done,
      complete: done
    });
  });
});
