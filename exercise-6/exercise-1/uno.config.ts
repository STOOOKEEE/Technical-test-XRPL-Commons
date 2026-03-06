import { defineConfig, presetUno, presetTypography, presetWebFonts } from 'unocss'

export default defineConfig({
  presets: [
    presetUno(),
    presetTypography(),
    presetWebFonts({
      fonts: {
        sans: 'Inter',
        mono: 'JetBrains Mono',
      },
    }),
  ],
  theme: {
    colors: {
      bg: '#000000',
      surface: '#111111',
      border: '#222222',
      text: '#FFFFFF',
      muted: '#888888',
      error: '#FF3333',
      success: '#33FF33',
    },
  },
})
