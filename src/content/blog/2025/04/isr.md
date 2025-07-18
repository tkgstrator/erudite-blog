---
title: ISRっていう仕組みが面白いと思った
date: 2025-04-15
description: NestJSのデプロイ方式の一つらしいのですが興味深かったです
tags: [Next.js]
authors: ['tkgstrator']
---


## NextJS

今回、ブログを一新するにあたって必要になったのは以下の点です。

1. Markdown形式で書けること
2. Markdown形式でファイルを保存しないこと
3. UIのカスタマイズ性が良いこと
4. 表示速度が速いこと
5. デプロイが速いこと

何故それぞれが必要になったのかを書きます。

### Markdown形式で書けること

もはや必須です、これなしに技術ブログは書けません。

### ファイルを保存しないこと

多分、今ほとんどの技術ブログ系は`.md`でファイルを保存してそれをデプロイする仕組みになっています。

ただ、この方式をやっているとちょっとテーマとかを変更したりしたときにFork元のレポジトリと整合性を保つのが難しくなります。fuwariは結構開発が頻繁に行われているレポジトリだったので、機能が追加されたときなどにRebaseするのが面倒でした。

よって、ファイルはレポジトリ自体に保存したくありませんでした。

### UIのカスタマイズ性が良いこと

要するにReactで簡単に書けるかということです。UIフレームワークへの依存性は減らしたかったのでChakraUIやMUIの採用は見送りました。

今回は純粋なTailwindCSSと一部にShadcn/uiなどで実装しています。

### 表示速度が速いこと

たびたび話題になったり、忘れたりするのですがウェブサイトをデプロイする上で最近は以下の四つの選択肢があると思います。

1. SSR(Server Side Rendering)
2. SSG(Static Site Generation)
3. CSR(Client Side Rendering)
4. ISR(Incremental Static Regeneration)

#### SSR

サーバーが生成したHTMLをクライアントが表示する方式。サーバーが生成するので、たくさんアクセスされると重いのと、サーバーのスペックやロケーションに左右される。

#### SSG

ビルド時にソースコードからHTMLを生成してそれをCDNで配信して表示する方式。サーバーレスなので爆速だが、コンテンツの内容を変更するときには再ビルドが必要になる。

#### CSR

空っぽのHTMLを配信して、クライアントサイドでJavaScriptを利用して表示する方式。コンテンツをサーバーから配信すれば、動的に内容を変更することができる。JavaScriptを初回に実行するので依存関係が増えるとファイルサイズが大きくなるのと、処理速度はあまり速くない。

### ISR

SSGとCSRのいいところを取ったような感じで、ビルドされたHTMLを表示するので超高速の表示速度に加えて、一定時間にページを更新することで再ビルドなしにコンテンツの中身を切り替えることができる。

ブログなど、常に最新の情報を提供しながらもSSGの速さを使いたいときに便利。

### デプロイが速いこと

これは正直、ページが大きくなれば遅くなってしまうのですがそれは仕方ないと思っています。

現状は速いですし、速度が困り始めたらまた考えようと思います。

## まとめ

NextJS+Vercel+ISRを採用することにしました。

記事の内容自体はCMSを利用してZennみたいに書くことができます。エディターの使い勝手はまだまだ微妙かなと思うこともあるのですが、今後のアップデートに期待です。

ISRはCloudflare Pagesだとちょっと面倒みたいなのでNextJSと親和性が良いVercelを採用しました。ドメイン自体はCloudflareが管理しているのでDNSを設定しています。
