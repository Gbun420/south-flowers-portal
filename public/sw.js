// Service Worker stub for MediAI
// Prevents 404 errors in browser console

self.addEventListener('fetch', (event) => {
  // Handle API requests
  if (event.request.url.includes('/api/')) {
    event.respondWith(
      new Response('API requests handled by server', {
        status: 200,
        headers: { 'Content-Type': 'text/plain' }
      })
    );
    return;
  }

  // Handle service worker requests
  if (event.request.url.includes('/sw.js')) {
    event.respondWith(
      new Response('Service Worker active', {
        status: 200,
        headers: { 'Content-Type': 'text/plain' }
      })
    );
    return;
  }

  // Handle other requests with basic response
  event.respondWith(
    new Response('MediAI Service Worker', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    })
  );
});
