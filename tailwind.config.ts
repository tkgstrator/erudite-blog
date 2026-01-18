// tailwind.config.ts
import type { Config } from 'tailwindcss'

const config: Config = {
  content: ['./app/**/*.{ts,tsx}', './components/**/*.{ts,tsx}', './content/**/*.{md,mdx}'],
  plugins: [require('@tailwindcss/typography')],
  theme: {
    extend: {}
  }
}
export default config
