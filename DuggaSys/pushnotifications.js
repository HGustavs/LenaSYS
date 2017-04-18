'use strict';

$(function() {

	var sendPushRegistrationToServer = function(subscription) {
		console.log(subscription);
		$.ajax({
			url: "pushnotifications.php",
			type: "POST",
			data: {action: 'register', subscription: subscription.toJSON()},
			dataType: "json",
			success: function() {
				console.log("Push data sent to server");
			}
		});
	};


	var subscribe = function() {
		var button = document.getElementById("activate_notifications");
		button.disabled = true;

		navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
			serviceWorkerRegistration.pushManager.subscribe({userVisibleOnly: true})
				.then(function(subscription) {
					sendPushRegistrationToServer(subscription);
				})
				.catch(function(e) {
					if (Notification.permission === 'denied') {
						console.log('Permission for Notifications was denied');
					} else {
						console.log('Unable to subscribe to push.', e);
					}
					alert("Could not subscribe to push notifications");
				});
		});
	};

	var initialiseState = function() {
		if (!('showNotification' in ServiceWorkerRegistration.prototype) ||
				Notification.permission === 'denied' ||
				!('PushManager' in window)) {
			console.log('Notifications is not supported or is disabled.');
			return;
		}
		navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
			serviceWorkerRegistration.pushManager.getSubscription()
				.then(function(subscription) {
					var button = document.getElementById("activate_notifications");
					button.disabled = false;
					button.addEventListener('click', subscribe);
				})
				.catch(function(err) {
					console.log('Error during getSubscription()', err);
				});
		});
	};
	
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('pushnotificationsserviceworker.js').then(initialiseState);
	} else {
		console.log('Service workers aren\'t supported in this browser.');
	}

});
