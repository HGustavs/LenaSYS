'use strict';

self.addEventListener('push', function(event) {
	var notificationText = event.data.text();
	event.waitUntil(
		self.registration.showNotification("LenaSYS Notification", {
			body: notificationText,
			badge: '../Shared/icons/Pen.png',
			icon: '../Shared/icons/LenasysIcon.png'
		})
	);
	self.registration.pushManager.getSubscription().then(function(subscription) {
		if (subscription) {
			fetch('pushnotifications.php', {
				method: 'POST',
				headers: {
					'Content-Type': 'application/x-www-form-urlencoded; charset=utf-8'
				},
				body: 'action=pushsuccess&endpoint=' + encodeURIComponent(subscription.endpoint)
			});
		}
	});
});

self.addEventListener('notificationclick', function(event) {
	event.notification.close();

	clients.openWindow("courseed.php");
});