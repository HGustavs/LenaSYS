'use strict';

$(function() {

	var sendPushRegistrationToServer = function(subscription) {
		$.ajax({
			url: "pushnotifications.php",
			type: "POST",
			data: {action: 'register', subscription: subscription.toJSON()},
			dataType: "text",
			success: function() {
				updateTextAndButton(true);
			}
		});
	};


	var subscribe = function() {
		$("#notificationsToggle").attr('disabled', true);

		navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
			var rawData = window.atob(push_notifications_vapid_public_key);
			var vapidKey = new Uint8Array(rawData.length);
			for (let i = 0; i < rawData.length; ++i) {
				vapidKey[i] = rawData.charCodeAt(i);
			}

			serviceWorkerRegistration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: vapidKey
			})
				.then(function(subscription) {
					sendPushRegistrationToServer(subscription);
				})
				.catch(function(e) {
					if (Notification.permission === 'denied') {
						$("#notificationsText").html("Push notifications has been disabled in your browser").css('color', '#a00');
					} else {
						$("#notificationsText").html("Unable to subscribe to push messaging, unknown error").css('color', '#a00');
					}
				});
		});
	};

	var unsubscribe = function() {
		$("#notificationsToggle").attr('disabled', true);
		alert("Not implemented");
	};

	var updateTextAndButton = function(subscribed) {
		if (subscribed) {
			$("#notificationsText").html("Push notifications are activated on this device.");
			$("#notificationsToggle").attr('disabled', false).off("click").on("click", unsubscribe).html("Deactivate push notifications");
		} else {
			$("#notificationsText").html("Push notifications are not activated on this device.");
			$("#notificationsToggle").attr('disabled', false).off("click").on("click", subscribe).html("Activate push notifications");
		}
	};

	var initialiseState = function() {
		if (!('showNotification' in ServiceWorkerRegistration.prototype) || !('PushManager' in window)) {
			$("#notificationsText").html("Push notifications not supported in this browser").css('color', '#a00'); // Notification or PushManager support not found
			return;
		}
		if (Notification.permission === 'denied') {
			$("#notificationsText").html("Push notifications has been disabled in your browser, please enable to use this function").css('color', '#a00'); // User has disabled push messaging
			return;
		}
		navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
			serviceWorkerRegistration.pushManager.getSubscription()
				.then(function(subscription) {
					updateTextAndButton(subscription !== null);
				})
				.catch(function(err) {
					console.log('Error during getSubscription()', err);
				});
		});
	};
	
	if ('serviceWorker' in navigator) {
		navigator.serviceWorker.register('pushnotificationsserviceworker.js').then(initialiseState);
	} else {
		$("#notificationsText").html("Push notifications not supported in this browser").css('color', '#a00'); // No service worker support found
	}

});
