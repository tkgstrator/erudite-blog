import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections'
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import expressiveCode from 'astro-expressive-code'
import icon from 'astro-icon'
import pagefind from 'astro-pagefind'

export default defineConfig({
  build: {
    format: 'file'
  },
  devToolbar: {
    enabled: false
  },
  integrations: [
    expressiveCode({
      defaultProps: {
        collapseStyle: 'collapsible-auto',
        overridesByLang: {
          'ansi,bat,bash,batch,cmd,console,powershell,ps,ps1,psd1,psm1,sh,shell,shellscript,shellsession,text,zsh,yaml':
            {
              showLineNumbers: true
            }
        },
        preserveIndent: true,
        showLineNumbers: true,
        wrap: true
      },
      plugins: [pluginCollapsibleSections(), pluginLineNumbers()],
      styleOverrides: {
        borderColor: 'var(--border)',
        codeBackground: 'color-mix(in oklab, var(--secondary) 25%, transparent)',
        codeFontFamily: 'var(--font-mono)',
        codeFontSize: '0.75rem',
        frames: {
          editorActiveTabBackground: 'color-mix(in oklab, var(--secondary) 25%, transparent)',
          editorActiveTabForeground: 'var(--muted-foreground)',
          editorActiveTabIndicatorBottomColor: 'transparent',
          editorActiveTabIndicatorTopColor: 'transparent',
          editorTabBarBackground: 'transparent',
          editorTabBarBorderBottomColor: 'transparent',
          editorTabBorderRadius: '0',
          frameBoxShadowCssValue: 'none',
          terminalBackground: 'color-mix(in oklab, var(--secondary) 25%, transparent)',
          terminalTitlebarBackground: 'transparent',
          terminalTitlebarBorderBottomColor: 'transparent',
          terminalTitlebarForeground: 'var(--muted-foreground)'
        },
        lineNumbers: {
          foreground: 'var(--muted-foreground)'
        },
        uiFontFamily: 'var(--font-sans)'
      },
      themeCssSelector: (theme) => `[data-theme="${theme.name.split('-')[1]}"]`,
      themes: ['github-light', 'github-dark'],
      useDarkModeMediaQuery: false
    }),
    pagefind(),
    mdx(),
    react(),
    sitemap(),
    icon()
  ],
  markdown: {
    // remarkPlugins: [remarkMath, remarkEmoji],
    syntaxHighlight: false
  },
  server: {
    host: true,
    port: 8080
  },
  site: 'https://blog.tkgstrator.work',
  vite: {
    plugins: [tailwindcss()]
  }
})
