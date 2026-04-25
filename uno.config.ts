import {
  defineConfig,
  presetUno,
  presetIcons,
} from 'unocss';

export default defineConfig({
  presets: [
    presetUno(),
    presetIcons({ scale: 1.1 }),
  ],
  theme: {
    colors: {
      sauce: '#d63031',
      sauceDeep: '#a51d1d',
      sauceHot: '#ff5252',
      tofu: '#fffaea',
      tofuShadow: '#f0d68c',
      chili: '#ffb5b5',
      negi: '#7ec850',
      sansho: '#fbe04e',
      cream: '#fff7e6',
    },
  },
});
