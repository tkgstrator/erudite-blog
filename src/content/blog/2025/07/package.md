---
title: Bunでビルドしたパッケージを公開する
date: 2025-07-20
description: TypeScriptで書いたパッケージを公開するときのポイントについての備忘録
tags: [TypeScript, Bun, NPM, GitHub]
authors: ['tkgstrator']
---

## 概要

TypeScriptで書いたコードをGitHub Package Registryで公開するときの備忘録です。

今後、使うことが多いと思うので、忘れないようにしておきます。

### 前提

コードをTypeScriptで書き、Bunでビルドして型情報をつけて第三者が利用できるようにします。

このとき、大事な点としてはBunはビルドしても型情報が出力されません。

```zsh
bun build src/index.ts --outdir dist
```

としても`dist/index.js`ができるだけで`index.d.ts`は出力されません。型情報がないとTypeScriptで利用するときに不便なので、どちらも出力されるようにします。

### ビルドツール

ChatGPTにきいたところ、有名どころのビルドツールが型情報の出力に対応しているか調べた結果が以下のとおりです。

|           | js  | d.ts |
| :-------: | :-: | :--: |
| bun build | ✔  |      |
| tsc       | ✔  | ✔   |
| tsup      | ✔  | ✔   |
| esbuild   | ✔  |      |
| swc       | ✔  |      |

あと、地味にですが`minify`や`console`の削除に対応してくれているとありがたいです。

これらも踏まえて、それぞれビルドにどのくらい時間がかかり、実際に利用できたかどうかを検証していきたいと思います。

## 比較

### bun

```zsh
vscode ➜ ~/app (master) $ bun run build
$ rimraf dist
$ bun build src/index.ts --outdir dist
Bundled 115 modules in 19ms

  index.js  1.1 MB  (entry point)
```

オプションを何もつけずにただビルドしただけで、型情報もありません。

最適化したオプションでビルドしてみます。

```zsh
vscode ➜ ~/app (master) $ bun build src/index.ts --minify --format=esm --target=bun --sourcemap --production --outdir dist
Bundled 111 modules in 19ms

  index.js      0.81 MB  (entry point)
  index.js.map  1.34 MB  (source map)
```

`minify`をつけると軽量化しますが、このままだとまだ`console.log`などは表示されます。

```zsh
vscode ➜ ~/app (master) $ bun run build
$ rimraf dist
$ bun build src/index.ts --minify --format=esm --target=bun --sourcemap --production --drop=console --drop=debugger --outdir dist
Bundled 111 modules in 21ms

  index.js      0.81 MB  (entry point)
  index.js.map  1.34 MB  (source map)
```

`--drop=console`をつけることで余計な出力がなくなります。そしてビルド時間はめちゃくちゃ速いです。

```zsh
.
├── index.js
└── index.js.map

1 directory, 2 files
```

いずれも、出力されたファイルは二つだけでした。

### tsup

```zsh
vscode ➜ ~/app (master) $ bun tsup
CLI Building entry: src/index.ts
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.0
CLI Using tsup config: /home/vscode/app/package.json
CLI Target: es2024
CLI Cleaning output folder
ESM Build start
ESM dist/index.js     242.11 KB
ESM dist/index.js.map 674.39 KB
ESM ⚡️ Build success in 66ms
DTS Build start
DTS ⚡️ Build success in 1272ms
DTS dist/index.d.ts 164.00 B
```

あらかじめ`package.json`に必要そうな情報を書いておきます。

```json
"tsup": {
  "entry": ["src/index.ts"],
  "format": ["esm"],
  "dts": true,
  "sourcemap": true,
  "clean": true,
  "alias": {
    "@mito-shogi/tsshogi-jsa": "./src/index.ts"
  },
  "minify": true,
  "target": "esnext"
},
```

出力されたファイルは三つでした。ただし、tsup自体にオプションでconsoleをドロップするような仕組みはないようです。

```zsh
.
├── index.d.ts
├── index.js
└── index.js.map
```

### tsc

```zsh
tsc --declaration --outDir dist --target esnext --module esnext --removeComments
```

```zsh
.
├── constant
│   ├── color.d.ts
│   ├── color.d.ts.map
│   ├── color.js
│   ├── color.js.map
│   ├── message_type.d.ts
│   ├── message_type.d.ts.map
│   ├── message_type.js
│   ├── message_type.js.map
│   ├── piece.d.ts
│   ├── piece.d.ts.map
│   ├── piece.js
│   └── piece.js.map
├── index.d.ts
├── index.d.ts.map
├── index.js
├── index.js.map
├── models
│   ├── message.dto.d.ts
│   ├── message.dto.d.ts.map
│   ├── message.dto.js
│   └── message.dto.js.map
└── utils
    ├── convert.d.ts
    ├── convert.d.ts.map
    ├── convert.js
    ├── convert.js.map
    ├── decode.d.ts
    ├── decode.d.ts.map
    ├── decode.js
    ├── decode.js.map
    ├── jsa.d.ts
    ├── jsa.d.ts.map
    ├── jsa.js
    └── jsa.js.map
```

いっぱいファイルが出力されます。また、最適化が一切行われていません。

### swc

最後にちょっとおまけで`swc`を試してみます。

```zsh
vscode ➜ ~/app (master) $ bun run build:swc
$ rimraf dist
$ swc src -d dist
Successfully compiled: 8 files with swc (11.39ms)
```

Rustで書かれた恐らく最速のトランスパイラですが、たしかにめちゃくちゃ速いです。

## 型情報の出力

`bun build`が単一ファイルが出力されるので`tsc`と組み合わせるのは得策でない気がします。

[この記事](https://qiita.com/macropygia/items/b321e9e5515de02f4dfd)によるとtsupと組み合わせて、`package.json`の`types`に指定しておけば動くらしいのでこちらを検討します。

bunのビルドが一番速いので、これが利用できれば便利です。

```zsh
vscode ➜ ~/app (master) $ bun run build
$ rimraf dist
$ bun build src/index.ts --minify --format=esm --target=bun --sourcemap --production --drop=console --drop=debugger --outdir dist
Bundled 111 modules in 18ms

  index.js      0.81 MB  (entry point)
  index.js.map  1.34 MB  (source map)

$ tsup src/index.ts --dts-only --format esm --out-dir dist
CLI Building entry: src/index.ts
CLI Using tsconfig: tsconfig.json
CLI tsup v8.5.0
CLI Using tsup config: /home/vscode/app/package.json
DTS Build start
DTS ⚡️ Build success in 1377ms
DTS dist/index.d.ts 164.00 B
```

組み合わせたところ、こんな感じになりました。

```zsh
vscode ➜ ~/app/dist (master) $ tree
.
├── index.d.ts
├── index.js
└── index.js.map

1 directory, 3 files
```

ファイルもちゃんと三つ出力されています。


### 比較

| ビルドツール | js  | d.ts | js.map |
| :----------: | :-: | :--: | :----: |
| bun + tsup   | ✔  | ✔   | ✔     |
| tsc          | ✔  | ✔   | ✔     |
| tsup         | ✔  | ✔   | ✔     |

ここまで比較すると`tsup`を組み合わせることで型情報を出力しつつ、ビルドできることがわかりました。

これだけ見るとどれでも良さそうな気がするのですが`bun build`であれば、

- consoleの削除
- minify
- soucemap
- esm対応

が一発でできるので、これを組み合わせて動くのであればこれが一番良さそうな気がします。

| ビルドツール | remove console | minify | sourcemap |
| :----------: | :------------: | :----: | :-------: |
| bun + tsup   | ✔             | ✔     | ✔        |
| swc + tsup   |                | ✔     | ✔        |
| tsup         |                | ✔     | ✔        |
| tsc          |                |        | ✔        |

> swcに関してはpluginを使えばremove consoleなどもできるらしいのだが、長くなりそうなので今回は割愛しました

## やってみた

```json
{
  "scripts": {
    "prebuild": "rimraf dist",
    "build": "bun build src/index.ts --format=esm --target=browser --sourcemap --production --drop=console --drop=debugger --outdir dist",
    "postbuild": "tsup src/index.ts --dts-only --format esm --out-dir dist",
  },
  "tsup": {
    "entry": ["src/index.ts"],
    "format": ["esm"],
    "dts": true,
    "sourcemap": true,
    "clean": true,
    "minify": true
  },
}
```

実際に利用したビルドコマンドはこんな感じになりました。
ビルドしたライブラリはCloudflare Workersで利用することを想定していたのですが、`--minify`を入れるとちゃんと関数を認識しなくなってしまったので外しました。

`tsup`はただ`d.ts`を生成するだけなのでここまでの設定は不要です。`prebuild`と`postbuild`を設定しているので、

```yaml
name: Deploy to Package Registry
on:
  pull_request:
    branches:
      - develop
      - master
    types: [closed]
  workflow_dispatch:
jobs:
  deploy:
    name: Deploy to GitHub Package Registry
    if: github.event.pull_request.merged == true || github.event_name == 'workflow_dispatch'
    runs-on: ubuntu-24.04
    steps:
      - name: Checkout
        uses: actions/checkout@v4
      - name: Set NPM Scope
        run: echo "SCOPE=@${GITHUB_REPOSITORY_OWNER}" >> $GITHUB_ENV
      - name: Bun
        uses: oven-sh/setup-bun@v2
        with:
          bun-version: latest
          registry-url: https://npm.pkg.github.com
          scope: ${{ env.SCOPE }}
      - name: Install Dependencies
        run: bun install --frozen-lockfile --ignore-scripts
      - name: Build
        run: bun run build
      - uses: actions/setup-node@v4
        with:
          node-version: latest
          registry-url: https://npm.pkg.github.com
          scope: ${{ env.SCOPE }}
      - name: Deploy
        run: npm publish --access public --registry=https://npm.pkg.github.com
        env:
          NODE_AUTH_TOKEN: ${{secrets.GITHUB_TOKEN}}
```

こう書いておけばGitHub Package Registryに自動で公開されます。

また、このときにGitHub Actionsのトークンでレジストリへの書き込みができるように、**Settings>Actions>General>Workflow permissions**から**Read and write permissions**に変更して書き込みができるようにしておきましょう。

### 使い方

`.npmrc`をプロジェクトルートに作成し、

```
//npm.pkg.github.com/:_authToken=${GITHUB_TOKEN}
@XXXXXXXX:registry=https://npm.pkg.github.com
```

のように書き込みます。これで`@XXXXXX/`から始まるパッケージをGitHub Package Registryからインストールできるようになります。また、`.env`に`GITHUB_TOKEN`を設定しておくのも忘れないようにしましょう。

あとは普通にインストールすればOKです。

## まとめ

やっとパッケージをリリースするための手順がわかってきました。

記事は以上。
