import adapter from '@sveltejs/adapter-node';
import preprocess from 'svelte-preprocess';
import path from 'path';

/** @type {import('@sveltejs/kit').Config} */
const config = {
    // Consult https://github.com/sveltejs/svelte-preprocess
    // for more information about preprocessors
    preprocess: preprocess(),

    kit: {
        adapter: adapter(),
        vite: {
            build: {
                chunkSizeWarningLimit: 1500
            },
            resolve: {
                alias: {
                    '@': path.resolve('./src'),
                    '@components': path.resolve('./src/components')
                }
            }
        }
    }
};

export default config;
