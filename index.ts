import index from './src/index.html';
import courses from './src/data/courses.json';

Bun.serve({
  port: 3000,
  routes: {
    '/': index,
    '/data/courses.json': Response.json(courses),
  },
  async fetch(req) {
    const url = new URL(req.url);

    // Раздача статических файлов из src
    if (url.pathname.startsWith('/images/')) {
      const file = Bun.file(`./src${url.pathname}`);
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
