import index from './src/index.html';

Bun.serve({
  port: 3000,
  routes: {
    '/': index,
  },
  async fetch(req) {
    const url = new URL(req.url);

    // Раздача статических файлов из public
    if (url.pathname.startsWith('/images/') || url.pathname.startsWith('/data/')) {
      const file = Bun.file(`./public${url.pathname}`);
      if (await file.exists()) {
        return new Response(file);
      }
    }

    return new Response('Not Found', { status: 404 });
  },
  development: {
    hmr: true,
    console: true,
  },
});

console.log('Server running at http://localhost:3000');
