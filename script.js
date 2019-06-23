window.addEventListener('load', function() {
  var isPushEnabled = false;

  var pushButton = document.querySelector('.js-push-button');
  pushButton.addEventListener('click', function () {
    if (isPushEnabled) {
      unsubscribe();
    } else {
      subscribe();
    }
  })

});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(initialiseState)
    .catch(err => console.warn('Error al tratar de registrar el sw', err))

}


  // Once the service worker is registered set the initial state
  function initialiseState() {

    console.log("Entro en inicializar");

    // Are Notifications supported in the service worker?
    if (!('showNotification' in ServiceWorkerRegistration.prototype)) {
      console.warn('Notifications aren\'t supported.');
      return;
    }

    // Check the current Notification permission.
    // If its denied, it's a permanent block until the
    // user changes the permission
    if (Notification.permission === 'denied') {
      console.warn('The user has blocked notifications.');
      return;
    }

    // Check if push messaging is supported
    if (!('PushManager' in window)) {
      console.warn('Push messaging isn\'t supported.');
      return;
    }

    // We need the service worker registration to check for a subscription
    navigator.serviceWorker.ready.then(function(serviceWorkerRegistration) {
      // Do we already have a push message subscription?
      serviceWorkerRegistration.pushManager.getSubscription()
          .then(function(subscription) {
            // Enable any UI which subscribes / unsubscribes from
            // push messages.
            var pushButton = document.querySelector('.js-push-button');
            pushButton.disabled = false;

            if (!subscription) {
              // We aren't subscribed to push, so set UI
              // to allow the user to enable push
              return;
            }

            // Keep your server in sync with the latest subscriptionId
            //sendSubscriptionToServer(subscription);

            // Set your UI to show they have subscribed for
            // push messages
            pushButton.textContent = 'Disable Push Messages';
            isPushEnabled = true;
          })
          .catch(function(err) {
            console.warn('Error during getSubscription()', err);
          });
    });
  }


