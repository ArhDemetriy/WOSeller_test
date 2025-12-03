import index from './src/index.html';
import courses from './src/data/courses.json';

Bun.serve({
  port: 3000,
  routes: {
    '/': index,
    '/data/courses.json': Response.json(courses),
  },
  development: {
    hmr: true,
    console: true,
  },
});

console.log('Server running at http://localhost:3000');
