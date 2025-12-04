// Service Worker stub for MediAI
// Prevents 404 errors in browser console

self.addEventListener('fetch', (event) => {
  const url = event.request.url;
  
  // Handle API requests - let them pass through to Next.js server
  if (url.includes('/api/')) {
    event.respondWith(
      new Response('API requests handled by server', {
        status: 200,
        headers: { 'Content-Type': 'text/plain' }
      })
    );
    return;
  }

  // Handle service worker registration
  if (url.includes('/sw.js')) {
    event.respondWith(
      new Response('Service Worker active', {
        status: 200,
        headers: { 'Content-Type': 'text/plain' }
      })
    );
    return;
  }

  // Handle other requests - let Next.js handle them
  event.respondWith(
    new Response('MediAI Service Worker Active', {
      status: 200,
      headers: { 'Content-Type': 'text/plain' }
    })
  );
});
