self.addEventListener('push', function(event) {
  if (event.data) {
    const data = event.data.json();
    const options = {
      body: data.body,
      icon: '/favicon.ico',
      vibrate: [100, 50, 100],
    };
    event.waitUntil(
      self.registration.showNotification(data.title, options)
    );
  }
});
