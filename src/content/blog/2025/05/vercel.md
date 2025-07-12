---
title: GitHub ActionsからVercelにデプロイする
date: 2025-05-12
description: Vercelのクレジットを節約するための方法です
tags: [TypeScript, Next.js, Vercel]
authors: ['tkgstrator']
---

# Vercel

VercelがNext.jsとの親和性が非常に高いため、最近愛用しています。

バックエンドとフロントエンドを一緒に動かしたいなってなったら多分Vite＋Reactでもできるんですが、これをやるとCSRかSSGのどっちかしかできません。

なのでもしも一部の機能にサーバーを使いたくて、更にそれをVercelにデプロイしたいっていう場合には最初からNext.jsを使えばよかったじゃんってなるわけです。

実際、最近そうなっていてNext.jsが便利だなと思い始めてからCloudflare PagesからVercelにどんどん移行しています。

## Hobby

VercelのプランにはHobby、Pro、Enterpriseとあるのですがほとんど全てのユーザーはHobbyかProのどっちかだと思います。

Cloudflare WorkersとかだとPaidプランにしても $5 とかだったので、VercelのProプランが $20 なのはやたらと強気に感じます。月額3000円ほどで、年間だと36000円もするのでAppleの開発者アカウントの三倍くらいかかるわけです。

よっぽどVercelに依存している、それこそ既存のCloudflareで使っているサービスを全部Vercelに移行するなら考えてもいい値段ですが、現在はPagesの代わりとしてだけ使っているのでそこまでの価値が見いだせていません。

その場合Hobbyプランには、一ヶ月に6000分のビルド時間制限があるのでこれをなんとか乗り越えたくなるわけです。

普通に使っていればまあ6000分でも余裕なんでしょうけれど、ガッツリ使う場合には困る場合が生じます。

## GitHub Actions

というわけで、GitHub ActionsからVercelへデプロイすることを考えます。

公開レポジトリであればGitHub Actionsのビルド時間は無制限に使えます。プライベートレポジトリの場合には2000分という制約はあるのでその場合はVercelをそのまま使えばいいですが、公開できるソースコードの場合にはGitHub Actionsを使うことでVercelのデプロイクレジットを消費しなくて済むというわけです。

また、GitHub Actionsもセルフホストで立てていればプライベートレポジトリであってもビルド時間は無制限ですし、後述するactを使えばローカルからランナーを使用せず無制限で高速なローカルビルド環境を利用してVercelへデプロイできます。

### 構成

Next.jsで開発している場合App Routerであれば大雑把に以下のような構成になっていると思います。

```zsh
.
├── .github/
│   ├── workflows/
│   │   └── development.yaml
│   └── workflow_dispatch.json
└── src/
    └── app
```

ここに、GitHub Actions用の定義である`.github/workflows/development.yaml`を作成します。

また、`act`を使ってローカル実行するための`.github/workflow_dispatch.json`も用意します。

```json
{
  "action": "workflow_dispatch"
}
```

`workflow_dispatch.json`の中身はこんな感じです。

肝心の`development.yaml`ですが、一例としては以下のようになります。

```yaml
name: Deploy NextJS to Vercel
env:
  VERCEL_ORG_ID: ${{ secrets.VERCEL_ORG_ID }}
  VERCEL_PROJECT_ID: ${{ secrets.VERCEL_PROJECT_ID }}
on:
  workflow_dispatch:
jobs:
  deploy:
    name: Vercel
    runs-on: ubuntu-24.04
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Bun
        uses: oven-sh/setup-bun@v1
        with:
          bun-version: latest
      - name: Install Vercel CLI
        run: bun add -g vercel@latest
      - name: Pull Vercel Environment Information
        run: vercel pull --yes --environment=production --token=${{ secrets.VERCEL_TOKEN }}
      - name: Install dependencies
        run: bun install --frozen-lockfile --ignore-scripts
      - name: Build NextJS
        run: vercel build --prod
      - name: Deploy Project Artifacts to Vercel
        run: vercel deploy --archive=tgz --prebuilt --prod --token=${{ secrets.VERCEL_TOKEN }}
```

`vercel`コマンドは対象のプロジェクトを選べず、何もしないと勝手にデフォルトのプロジェクトにデプロイしてしまうので`env`で指定する必要があります。この値についてはVercelのダッシュボードから確認できるので詳しくは割愛します。

https://vercel.com/guides/how-can-i-use-github-actions-with-vercel

この設定では手動でしかビルドが実行されないようになっているので、プッシュあるいはPRのクローズ時に実行させたい場合には内容を適時変更してください。

### act

で、この設定をGitHubにプッシュした時点でActionsから手動でWorkflowが実行できるようになっています。

ただ、この場合にはセルフホストの場合を除き公式のそこまでスペックの高くないマシンで実行することになるので、できれば高速なローカルマシンでビルドをしたいなとなるわけです。

その時に利用できるのが`act`で、簡単に言えばGitHub Actionsをローカルで実行できるプログラムです。

https://github.com/nektos/act

`act`はmacOSであればHomebrewなどを使ってもインストールできるのですが、自分はdindを使ってDev Containerから実行するようにしています。そうすれば環境も汚れないのでクリーンです。

1. https://github.com/dhoeric/features/pkgs/container/features%2Fact
2. https://github.com/devcontainers-extra/features/pkgs/container/features%2Fvercel-cli

`act`も`vercel`もfeaturesから簡単にインストールできるので便利です。

## コマンド

このコマンドでローカルでGitHub Actionsを実行し、あたかもウェブ上からWorkflowを実行したかのような効果が得られます。

`act -j deploy --eventpath .github/workflow_dispatch.json --secret-file .secrets --platform ubuntu-24.04=catthehacker/ubuntu:act-22.04`

このとき、`.secrets`にVercelへアクセスするための情報を書き込んでおく必要があります。

```
VERCEL_TOKEN=
VERCEL_ORG_ID=
VERCEL_PROJECT_ID=
```

形式としては`.env`と同じなので、特に困ることはないでしょう。

ローカルマシンが公式のランナーよりも高速の場合にはこちらのほうが簡単にデプロイすることができます。

また、ビルドがDocker内で実行されるので開発環境を立ち上げているときでも`.next`の中身が壊れたりしないため開発しながらビルドしたりがすることができます。

# まとめ

VercelとGitHub ActionsとNext.jsの親和性は非常に高い。良いマシンが欲しくなってくる。
