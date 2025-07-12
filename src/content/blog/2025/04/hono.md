---
title: Honoを利用するときに忘れがちなこと
date: 2025-04-30
description: 備忘録としてメモしておきます
tags: [Hono]
authors: ['tkgstrator']
---

# Hono

軽量かつCloudflare Workersに完全に対応している便利なフレームワークです。

これがでてからNest.jsは使うことがなくなりました。

で、今回はHonoを使っていて「これってどうやるのかな」と思ったことについてまとめます。

## エラー処理

hono + openapi-zod-clientを利用していると入力値のバリデーションにコケた場合に`ZodError`が発生します。で、これはこれでいいのですが、この時点で勝手に400 BadRequestが返ってしまい、

```ts
app.onError(async (error, c) => {
  if (error instanceof HTTPException) {
    return c.json({ message: error.message }, error.status)
  }
  if (error instanceof ZodError) {
    return c.json({ message: error.message, description: error.cause }, 400)
  }
  return c.json({ message: error.message }, 500)
})
```

こう書いたときのこの処理が実行されません。

それでは困るので`defaultHook`で対応します。

```ts
const app = new Hono<{ Bindings: Bindings }>({
  defaultHook: (result) => {
    if (!result.success) {
      throw result.error
    }
  }
})
```

こんな感じで設定します。

するとちゃんとエラーがとんできます。このとき`defaultHook`は必ずバリデーションエラーが発生するHonoインスタンスに対してつけてください。

## Prisma

Cloudflare WorkersではPrisma以外を使うのがいいみたいなんですが、クエリの書き方がこれが一番好きなのでまだ愛用しています。

WorkersはエッジサーバーなのでPrismaを都度初期化していると大変コストがかかってしまうのでCPU時間が足りません。そのためにいろいろ苦労されているみたいです。

```ts
import { PrismaClient } from '@prisma/client'

type Bindings = {
  prisma: PrismaClient
}

const prisma = new PrismaClient()
app.use('*', async (c: Context<{ Bindings: Bindings }>, next) => {
  c.env.prisma = prisma
  await next()
})
```

こういう感じで定義しておいて、グローバルにprismaを一回だけ初期化しておけば、そのインスタンスを使い回すことができます。

HonoのインスタンスにもBindingsで渡してあげればTypeScriptの型を利用して`c.env.prisma`としてDBへのアクセスができるようになります。

### マイグレーション

以前、DBのマイグレーションを何もわかっていなかったので都度、migrationsディレクトリをふっとばして不整合を起こしていましたが、migrationsディレクトリは消さないほうがいいです（戒め）

## Docker

Honot + PrismaのアプリケーションをDockerイメージにするとき、気をつけなければいけないことがあります。

それは、イメージが立ち上がったときにイメージ内にある`migrations`を元に、DBのマイグレーションを実行しなければいけないということです。

そうでないとアプリケーション定義とDBの間に齟齬が生じて、エラーが発生します。

つまり、コンテナが立ち上がると`prisma migrate deploy`を実行したいが、`bun dist/index.js`もしたいわけです。Dockerfileに`CMD`は一つしか書けないのでこれは困ります。

### Dockerfile

```dockerfile
ARG BUN_VERSION=1.2.9

FROM oven/bun:${BUN_VERSION} AS build
WORKDIR /app

COPY . .
RUN bun install --frozen-lockfile --ignore-scripts --silent --production
RUN bunx prisma generate
RUN bun run build

FROM oven/bun:${BUN_VERSION}-slim
ENV NODE_ENV=production
WORKDIR /app

COPY --from=build /app/node_modules node_modules
COPY --from=build /app/dist dist
COPY --from=build /app/prisma prisma
COPY --from=build /app/entrypoint.sh /entrypoint.sh

RUN chmod +x /entrypoint.sh

ENTRYPOINT [ "/entrypoint.sh" ]
CMD ["bun", "dist/index.js"]
```

というDockerfileと、以下のような`entrypoint.sh`を用意します。

```sh
#!/bin/sh

bunx prisma migrate deploy

exec "$@"
```

この`entrypoint.sh`がポイントで、実行後にCMDが実行されます。よって、マイグレーションしてからサービスを立ち上げることができるようになります。

すると新しくイメージを引っ張ってきて立ち上げ直すだけでいいよ、楽ですね。

# まとめ

Honoは奥深い。
