import { defineConfig } from 'vite';
import solid from 'vite-plugin-solid';
import UnoCSS from 'unocss/vite';

export default defineConfig({
  base: '/mapo-tofu/',
  plugins: [UnoCSS(), solid()],
  server: { port: 5174, host: '127.0.0.1' },
});
