---
title: SwiftコードのCI/CDをGitHub Actionsで実行する
date: 2025-07-13
description: TypeScriptなどは簡単ですが、macOSを使うものはちょっとクセがあったので対応しました
tags: [Swift, Xcode, GitHub, GitHub Actions]
authors: ['tkgstrator']
---

## 背景

最近、またちょっとSwiftのコードを触り始めたのですが、そういえばやろうやろうと思いながらSwiftのコードのCI/CDをちゃんとやってこなかったなあというのが気になってきました。

### CI

自分の中では、CI/CDには以下の機能を持たせたいと思っています

1. コードのフォーマットと整形
2. テストの実行
3. コミットメッセージのチェック
4. ビルドが通るかどうか

1に関してはTypeScriptの場合にはbiomeで対応していますが、Swiftの場合にはSwiftLintとSwiftFormatが該当します。

> SwiftFormatは全く違う二種類のツールがあるので、混同しないようにしないといけません。

テストの実行はXCTestというものがあるのでそれを実行します。UnitTestくらいなら簡単に書けますが、UIのテストとなるとめんどくさそうです。

ライブラリの場合には基本的にUnitTestさえ通ればまあなんとかなるだろうと思っているので、今回はこちらだけ実装しました。

コミットメッセージはGitDocを使ったときにcommitlintのフォーマットに沿うようにコメントを書かせているのですが、たまにLLMが反応せずに日付だけのコミットメッセージが生成されてしまうのでその対策です。

commitlintはNode.jsで動くツールなので、そのためだけにCIの中で一瞬だけインストールするようにしています。ただ、ベースとなるNode.jsはGitHub ActionsのRunnerにデフォルトで入っているのでそこは問題ありません。

ビルドが通るかどうかは、コードの不具合等がないかをチェックします。Bunの場合にはトランスパイルで型チェックなどが行われないので、Bunとは別にtscなどでチェックする必要があるでしょう。Next.jsの場合にはそこも多分やってくれているので単に`next build`が通れば大丈夫です。

ビルドは規模が大きくなると時間がかかる場合もあるので「PRがある場合にしかチェックしない」とかでもいいと思います。

### CD

これに加えて、

1. 自動バージョニング
2. デプロイ
3. PRAgentを利用したLLMによるコードレビュー
4. 自動タグ付け

ができれば更に良いなと思っており、いくつかのレポジトリでは実験的に実践しています。

自動バージョニングは割と簡単で、`feature/**`を`develop`にマージしたときにマイナーバージョンを上げる（0.0.1→0.1.0）、`fix/**`を`develop`にマージしたときにパッチバージョンを上げる（0.0.1→0.0.2）という単純なもので、　`develop`を`master`にマージしたときにメジャーバージョンを更新するような感じです。

これはGitHub Actions側が勝手にコミットを追加するような感じですので、実際にバージョンを上げるかどうかはマージするまでわからないのでマージ後にマージ先のブランチでバージョンを上げるという処理をしています。

ただ、マージ後にマージ元にコミットを追加してしまう方式でもいいかもしれません。

デプロイに関しては現状、Container Registry、Vercel、 Netlify、 Package Registry、 Docker Hub、 Cloudflare Pages、 Cloudflare Workersに関しては一通り試しています。

VercelやNetlify, Cloudflare系はGit連携して自動でデプロイなどもできますが、自分の好きなタイミングでデプロイできることなどからGitHub Actionsを利用しています。

LLMでの自動コードレビューは中身をガッツリ読んでいるわけではないのですが、たまにミスがあったときなどに教えてくれるので重宝しています。コストも`mini`系を使えばほぼタダ同然なので便利です。

自動タグ付けはまだほぼ実践できていません。だって他に使う人がいないですし......

## GitHub Actions

では、本命のSwiftコード用のGitHub Actionsですが、以下のようにしてみました。

```yaml
name: Continuous Integration
on:
  push:
jobs:
  commitlint:
    name: CommitLint
    if: github.event.action != 'closed' || github.event.pull_request.merged != true
    runs-on: ubuntu-latest
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest
      - name: Install commitlint
        run: |
          bun install conventional-changelog-conventionalcommits
          bun install commitlint@latest
          bun install @commitlint/config-conventional@latest
      - name: Validate current commit (last commit) with commitlint
        if: github.event_name == 'push'
        run: bunx commitlint --last --verbose
      - name: Validate PR commits with commitlint
        if: github.event_name == 'pull_request'
        run: bunx commitlint --from ${{ github.event.pull_request.head.sha }}~${{ github.event.pull_request.commits }} --to ${{ github.event.pull_request.head.sha }} --verbose
  check:
    name: Code Check
    runs-on: macos-latest
    if: github.event.action != 'closed' || github.event.pull_request.merged != true
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Install dependencies
        run: |
          brew install swiftlint swiftformat
      - name: Run SwiftLint
        run: |
          swiftlint
      - name: Run SwiftFormat in lint mode
        run: |
          swiftformat . --lint
  test:
    name: Test
    runs-on: macos-15
    if: github.event.action != 'closed' || github.event.pull_request.merged != true
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - uses: maxim-lobanov/setup-xcode@v1
        with:
          xcode-version: 16.4
      - name: Build the Swift package
        run: |
          swift build --build-tests
      - name: Run tests
        run: |
          swift test
```

ポイントとなるところは`macos-15`を指定している点で、まだ`macos-latest!=macos-15`らしいです。なので、`macos-latest`を指定すると`Xcode 16.4`が使えなくなってしまいます。

コミットのチェックに関してはUbuntuでも実行できるのであえて`macos-latest`は利用していません。

`swiftlint`と`swiftformat`は最初から入っていたりもするのですが、一応インストールするようにしています。この内容で、ちゃんと動いていることが確認できたので多分大丈夫だと思います。

## まとめ

LLMの力を借りてGitHub Actionsを書いてみたのですが、非常に簡単にかけて驚いています。

実際にアプリをビルドしてリリースするところも`fastlane`などを利用してかければなと思っています。これに関してはおそらく一ヶ月以内くらいに記事にするでしょう。

早くAppleの審査が終わらないかなと思っています。

記事は以上。
