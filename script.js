window.addEventListener('load', function() {
  var isPushEnabled = false;

  var pushButton = document.querySelector('.js-push-button');
  pushButton.addEventListener('click', function () {
    if (isPushEnabled) {
      unsubscribe();
    } else {
      subscribe();
    }
  });

});

if ('serviceWorker' in navigator) {
  navigator.serviceWorker.register('sw.js')
    .then(initialiseState)
    .catch(err => console.warn('Error al tratar de registrar el sw', err))

}


  // Once the service worker is registered set the initial state
  function initialiseState() {

    console.log("Entro en inicializar");


    const title = "Nuevo titulo";
    const body = "Cuerpo de la notification";
    const icon = "icon";
    const tag = "tag";
    const link = "http://www.google.com";

    var options = {
      body: body,
      tag: tag,
      icon: icon,
      data: {
        link: link
      }
    };


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

    Notification.requestPermission(status => {
      console.log(status);
    });

    navigator.serviceWorker.getRegistration().then(reg => {
      reg.showNotification(title, options)
    });

}

function subscribe() {
  // Disable the button so it can't be changed while
  // we process the permission request
  var pushButton = document.querySelector('.js-push-button');
  pushButton.disabled = true;

        navigator.serviceWorker.pushManager.subscribe({
          userVisibleOnly: true,
        }).then(function(subscription) {
          // The subscription was successful
          isPushEnabled = true;
          pushButton.textContent = 'Disable Push Messages';
          pushButton.disabled = false;

          // TODO: Send the subscription.endpoint to your server
          // and save it to send a push message at a later date
          console.log("Enviar subscription");
          console.log(subscription);
          return true;
        })
        .catch(function(e) {

          console.log(e);
          console.log(Notification);

          if (Notification.permission === 'denied') {
            // The user denied the notification permission which
            // means we failed to subscribe and the user will need
            // to manually change the notification permission to
            // subscribe to push messages
            console.warn('Permission for Notifications was denied');
            pushButton.disabled = true;
          } else {
            // A problem occurred with the subscription; common reasons
            // include network errors, and lacking gcm_sender_id and/or
            // gcm_user_visible_only in the manifest.
            console.log('Unable to subscribe to push.', e);
            pushButton.disabled = false;
            pushButton.textContent = 'Enable Push Messages';
          }
        });
}


