import { rehypeHeadingIds } from '@astrojs/markdown-remark'
import mdx from '@astrojs/mdx'
import react from '@astrojs/react'
import sitemap from '@astrojs/sitemap'
import { pluginCollapsibleSections } from '@expressive-code/plugin-collapsible-sections'
import { pluginLineNumbers } from '@expressive-code/plugin-line-numbers'
import swup from '@swup/astro'
import tailwindcss from '@tailwindcss/vite'
import { defineConfig } from 'astro/config'
import embeds from 'astro-embed/integration'
import expressiveCode from 'astro-expressive-code'
import icon from 'astro-icon'
import pagefind from 'astro-pagefind'
import rehypeAutolinkHeadings from 'rehype-autolink-headings'
import rehypeDocument from 'rehype-document'
import rehypeExternalLinks from 'rehype-external-links'
import rehypeKatex from 'rehype-katex'
import rehypePrettyCode from 'rehype-pretty-code'
import remarkEmoji from 'remark-emoji'
import remarkMath from 'remark-math'
import { SITE } from './src/consts'
import rehypeLinkCard from './src/lib/rehype/link-card'

export default defineConfig({
  // adapter: vercel({
  //   webAnalytics: {
  //     enabled: true
  //   }
  // }),
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
          'ansi,bat,bash,batch,cmd,console,powershell,ps,ps1,psd1,psm1,sh,shell,shellscript,shellsession,text,zsh': {
            showLineNumbers: false
          }
        },
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
    embeds({
      services: {
        LinkPreview: false
      }
    }),
    mdx(),
    react(),
    sitemap(),
    icon(),
    swup({
      accessibility: true,
      cache: true,
      containers: ['main', '#mobile-header'],
      preload: true,
      progress: true,
      smoothScrolling: true,
      updateHead: true
    }),
    pagefind()
  ],
  markdown: {
    rehypePlugins: [
      [
        rehypeLinkCard,
        {
          linkcardUrl: SITE.linkcard,
          rel: ['nofollow', 'noreferrer', 'noopener'],
          target: '_blank'
        }
      ],
      [
        rehypeDocument,
        {
          css: 'https://cdn.jsdelivr.net/npm/katex@0.16.21/dist/katex.min.css'
        }
      ],
      [
        rehypeExternalLinks,
        {
          rel: ['nofollow', 'noreferrer', 'noopener'],
          target: '_blank'
        }
      ],
      rehypeHeadingIds,
      [
        rehypeAutolinkHeadings,
        {
          behavior: 'wrap',
          content: []
        }
      ],
      rehypeKatex,
      [
        rehypePrettyCode,
        {
          theme: {
            dark: 'github-dark',
            light: 'github-light'
          }
        }
      ]
    ],
    remarkPlugins: [remarkMath, remarkEmoji],
    syntaxHighlight: false
  },
  output: 'static',
  server: {
    host: true,
    port: 1234
  },
  site: 'https://blog.tkgstrator.work',
  vite: {
    experimental: {
      // enableNativePlugin: true,
    },
    optimizeDeps: {
      exclude: ['@resvg/resvg-js']
    },
    plugins: [tailwindcss()]
  }
})
