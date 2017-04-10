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
});

self.addEventListener('notificationclick', function(event) {
	event.notification.close();

	clients.openWindow("courseed.php");
});