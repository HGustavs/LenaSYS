'use strict';


function subscribe() {
  var button = document.getElementById("activate_notifications");
  button.disabled = true;

  navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
    serviceWorkerRegistration.pushManager.subscribe({userVisibleOnly: true})
      .then(function(subscription) {
        console.log(subscription);
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
}

function initialiseState() {
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
}

window.addEventListener('load', function() {
  if ('serviceWorker' in navigator) {
    navigator.serviceWorker.register('pushnotificationsserviceworker.js').then(initialiseState);
  } else {
    console.log('Service workers aren\'t supported in this browser.');
  }
});
