import type { ElementContent, Root } from 'hast'
import { visit } from 'unist-util-visit'

// https://pote-chil.com/posts/astro-rehype-plugin

interface Options {
  linkcardUrl: string
  target?: '_blank' | '_self' | '_parent' | '_top'
  rel?: string[]
}

const rehypeLinkCard = ({ linkcardUrl, target, rel }: Options) => {
  return (tree: Root) => {
    visit(tree, 'element', (node, index, parent) => {
      // paragraph じゃなかったら return
      if (!parent || typeof index !== 'number' || node.tagName !== 'p') {
        return
      }

      // 空のテキストノードを除外
      const children = node.children.filter((child) => child.type !== 'text' || child.value.trim() !== '')

      // 子要素が<a>タグ一つだけかチェック
      if (children.length !== 1) {
        return
      }

      const linkNode = children[0]
      if (linkNode.type !== 'element' || linkNode.tagName !== 'a') {
        return
      }

      const href = linkNode.properties?.href
      if (typeof href !== 'string') {
        return
      }

      // TODO: 内部リンクを特殊として扱う？
      //   // 内部リンクは対象外
      //   if (href.startsWith("/") || href.startsWith("#")) {
      //     return;
      //   }

      const src = new URL(`/embed?url=${encodeURIComponent(href)}`, linkcardUrl).href

      const elem = {
        children: [
          {
            children: [
              {
                children: [],
                properties: {
                  src: src
                },
                tagName: 'iframe',
                type: 'element'
              }
            ],
            properties: {
              href: href,
              rel: rel ?? ['nofollow', 'noreferrer', 'noopener'],
              target: target ?? '_blank'
            },
            tagName: 'a',
            type: 'element'
          }
        ],
        properties: {
          class: 'linkcard'
        },
        tagName: 'span',
        type: 'element'
      } satisfies ElementContent

      parent.children.splice(index, 1, elem)
    })
  }
}

export default rehypeLinkCard
