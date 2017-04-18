'use strict';

self.addEventListener('push', function(event) {
	event.waitUntil(
		self.registration.showNotification("LenaSYS Notification", {
			body: "New stuff has happened"
		})
	);
});

self.addEventListener('notificationclick', function(event) {
	event.notification.close();

	client.openWindow("/");
});