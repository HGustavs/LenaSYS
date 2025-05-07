'use strict';

document.addEventListener('DOMContentLoaded', function () {

	let sendPushRegistrationToServer = function (subscription, deregister) {
		let action;

		if (deregister === true) {
			action = "deregister";
		} else {
			action = "register";
		}

		let data = new URLSearchParams();
		data.append("action", action);
		data.append("subscription", JSON.stringify(subscription.toJSON()));

		fetch("pushnotifications.php", {
			method: "POST",
			headers: {
				"Content-Type": "application/x-www-form-urlencoded"
			},
			body: data
		})
		.then(response => response.text())
		.then(() => {
			window.setTimeout(function () {
				updateTextAndButton(deregister !== true);
			}, 1000);
		})
		.catch(error => {
			console.error("Error sending push registration:", error);
		});
	};


	let subscribe = function() {
		document.getElementById("notificationsToggle").disabled = true;

		navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
			var rawData = window.atob(push_notifications_vapid_public_key);
			var vapidKey = new Uint8Array(rawData.length);
			for (var i = 0; i < rawData.length; ++i) {
				vapidKey[i] = rawData.charCodeAt(i);
			}

			serviceWorkerRegistration.pushManager.subscribe({
				userVisibleOnly: true,
				applicationServerKey: vapidKey
			})
				.then(function(subscription) {
					sendPushRegistrationToServer(subscription);
				})
				.catch(function (e) {
					const notificationsText = document.getElementById("notificationsText");
					if (Notification.permission === "denied") {
						notificationsText.innerHTML = "Push notifications has been disabled in your browser";
						notificationsText.style.color = "#a00";
					} else {
						notificationsText.innerHTML = "Unable to subscribe to push messaging, unknown error";
						notificationsText.style.color = "#a00";
					}
				});
		});
	};

	let unsubscribe = function() {
		document.getElementById("notificationsToggle").disabled = true;

		navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
			serviceWorkerRegistration.pushManager.getSubscription()
				.then(function(subscription) {
					if (subscription) {
						sendPushRegistrationToServer(subscription, true);
						subscription.unsubscribe();
					}
				})
				.catch(function (error) {
					const notificationsText = document.getElementById("notificationsText");
					notificationsText.innerHTML = "Error unsubscribing";
					notificationsText.style.color = "#a00";
					console.log('Error unsubscribing', error);
				});
		});
	};

	let updateTextAndButton = function(subscribed) {
		const notificationsText = document.getElementById("notificationsText");
		const notificationsToggle = document.getElementById("notificationsToggle");

		if (subscribed) {
			notificationsText.innerHTML = "Push notifications are activated on this device.";
			notificationsToggle.removeEventListener("click", subscribe);
			notificationsToggle.addEventListener("click", unsubscribe);
			notificationsToggle.innerHTML = "Deactivate push notifications";
			notificationsToggle.disabled = false;
		} else {
			notificationsText.innerHTML = "Push notifications are not activated on this device.";
			notificationsToggle.removeEventListener("click", unsubscribe);
			notificationsToggle.addEventListener("click", subscribe);
			notificationsToggle.innerHTML = "Activate push notifications";
			notificationsToggle.disabled = false;
		}

	};

	let initialiseState = function() {
		const notificationsText = document.getElementById("notificationsText");

		if (!("showNotification" in ServiceWorkerRegistration.prototype) || !("PushManager" in window)) {
			notificationsText.innerHTML = "Push notifications not supported in this browser";
			notificationsText.style.color = "#a00";
			return;
		}

		if (Notification.permission === "denied") {
			notificationsText.innerHTML = "Push notifications have been disabled in your browser, please enable to use this function";
			notificationsText.style.color = "#a00"; 
			return;
		}
		navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
			serviceWorkerRegistration.pushManager
				.getSubscription()
				.then((subscription) => {
					updateTextAndButton(subscription);
				})
				.catch((err) => {
					console.log("Error during getSubscription()", err);
				});
		});
	};

	if ("serviceWorker" in navigator) {
		navigator.serviceWorker.register("pushnotificationsserviceworker.js").then(initialiseState);
	} else {
		const notificationsText = document.getElementById("notificationsText");
		notificationsText.innerHTML = "Push notifications not supported in this browser";
		notificationsText.style.color = "#a00"; // No service worker support found
	}
});
