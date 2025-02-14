import { build, preview } from 'vite';

(async () => {
  try {
    await preview({
      BASE_URL: '/',
      MODE: 'production',
      DEV: false,
      PROD: true,
    });
    console.log('Preview server is running...');
    console.log('Listening on http://localhost:4173\n');

    await build({
      build: {
        rollupOptions: {
          input: {
            index: 'index.html',
            // popup: 'popup.html',
            // offscreen: 'offscreen.html',
          },
        },
        chunkSizeWarningLimit: 1024,
        watch: {},
      },
    });
    console.log('Build in watch mode is running...');
  } catch (err) {
    console.error('Error:', err);
  }
})();
