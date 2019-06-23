//asignar un nombre y versión al cache
const CACHE_NAME = 'v1_cache_demo_renta',
  urlsToCache = [
    './',
    'https://fonts.googleapis.com/css?family=Raleway:400,700',
    'https://use.fontawesome.com/releases/v5.0.7/css/all.css',
    'vendor/fontawesome-free/css/all.min.css" rel="stylesheet',
    'https://fonts.googleapis.com/css?family=Montserrat:400,700" rel="stylesheet',
    'https://fonts.googleapis.com/css?family=Lato:400,700,400italic,700italic',
    './css/freelancer.min.css',
    './js/script.js',
    './vendor/jquery/jquery.min.js',
    './vendor/bootstrap/js/bootstrap.bundle.min.js',
    './vendor/jquery-easing/jquery.easing.min.js',
    './js/contact_me.js',
    './js/freelancer.min.js',
    './js/script.js'

  ]

//durante la fase de instalación, generalmente se almacena en caché los activos estáticos
self.addEventListener('install', e => {
  e.waitUntil(
    caches.open(CACHE_NAME)
      .then(cache => {
        return cache.addAll(urlsToCache)
          .then(() => self.skipWaiting())
      })
      .catch(err => console.log('Falló registro de cache', err))
  )
})

//una vez que se instala el SW, se activa y busca los recursos para hacer que funcione sin conexión
self.addEventListener('activate', e => {
  const cacheWhitelist = [CACHE_NAME]

  e.waitUntil(
    caches.keys()
      .then(cacheNames => {
        return Promise.all(
          cacheNames.map(cacheName => {
            //Eliminamos lo que ya no se necesita en cache
            if (cacheWhitelist.indexOf(cacheName) === -1) {
              return caches.delete(cacheName)
            }
          })
        )
      })
      // Le indica al SW activar el cache actual
      .then(() => self.clients.claim())
  )
})

//cuando el navegador recupera una url
self.addEventListener('fetch', e => {
  //Responder ya sea con el objeto en caché o continuar y buscar la url real
  e.respondWith(
    caches.match(e.request)
      .then(res => {
          //recuperar del cache
          return res || fetch(e.request)

      })
  )
})

self.addEventListener("push", function (event) {

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
    event.waitUntil(


        self.registration.showNotification(title, options)
    )

    /*try {
        var payload = JSON.parse(event.data.text());
        var title = payload.title;
        var options = {
            body: payload.message,
            data: {
                link: payload.link
            }
        };
        event.waitUntil(
            self.registration.showNotification(title, options)
        )
    } catch (error) {
        console.log(event.data.text());
        console.log(error.message);
    }*/

});

