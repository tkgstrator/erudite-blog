---
title: Zodでジェネリクスを使って型定義をする
date: 2025-05-07
description: よく使うのに忘れるのでメモしておきましょう
tags: [TypeScript, Zod]
authors: ['tkgstrator']
---

# Zod

TypeSafeに型定義をしてJSONなどのレスポンスをパースできる仕組みです。

ただ単なるパーサーにとどまらず、`zod-openapi-client`や`zodios`など様々なところに利用されています。以前ちょっとだけお話した`EffectTS`はその辺が全然ダメだったイメージがあるのでやはりZod一強なのかなと思っています。

他にもいろいろTypeSafeを実現するためのライブラリはあるのですが、個人的にはZodが一番好きなので愛用しています。

で、これをより便利にジェネリクスを使って定義したいよね、というお話。

## ジェネリクス

```ts
{
  "data": {
    "id": 0
  }
}
```

やりたいこととしてはものすごく簡単で、例えば上のようなレスポンスを返す`/v1/blogs/:id`があったとします。で、当然ブログの記事一覧を取得する`/v1/blogs/`もあるわけですが、そのレスポンスが、

```ts
{
  "data": [
    {
      "id": 0
    }
  ]
}
```

となることが多いわけです。つまり、データ構造はほぼ同じなのに返ってくるのが配列かそうでないかという違いが発生します。

スプラトゥーン3のレスポンスもそうでしたが、ベースとなる構造はほぼ一緒で`data`の中身だけが違うということは往々にしてあるわけです。そのとき、毎回全部のレスポンスを定義していたら大変ですよね。なので、ジェネリクスを使いましょう。

### ジェネリクスを使った方法

さっきのものを何も考えずに定義すると以下のようになります。

```ts
const DatumSchema = z.object({
  data: z.object({
    id: z.number().int()
  })
})

const ListDatumSchema = z.object({
  data: z.array(z.object({
    id: z.number().int()
  }))
})
```

これだけならそんなに苦労じゃないですが、オブジェクトの構造が深くなると面倒です。

```ts
const DatumSchema = z.object({
  id: z.number().int()
})

const PluralOrSingularSchema = z.object({
  data: Datum.or(z.array(Datum))
})
```

一応このようにも書けるのですが、この場合は`data`が配列かそうでないかを毎回チェックする必要が生じ、非常に手間になります。

そこで、`data`はZodSchemaに適合していれば何でも受け取れるようにしてしまいます。

```ts
conts GenericsSchema = <T extends ZodSchema>(S: T) => z.object({
  data: S
})
```

こうすることでZodSchemaに適合する全てのオブジェクトを引数として受け取れます。

```ts
GenericsSchema(DatumSchema).parse(body)
GenericsSchema(z.array(DatumSchema)).parse(body)
```

とすれば共通のスキーマを利用して使い分けることができます。

`data`が何パターンもある場合には、

```ts
conts ItemSchema = <T extends ZodSchema>(S: T) => z.object({
  data: S
})

conts ListSchema = <T extends ZodSchema>(S: T) => z.object({
  data: z.array(S)
})
```

としても良いかもしれません。

### 型

で、こうやって定義したスキーマですが、


```ts
const DatumSchema = z.object({
  data: z.object({
    id: z.number().int()
  })
})

export type Datum = z.infer<DatumSchema>

conts ItemSchema = <T extends ZodSchema>(S: T) => z.object({
  data: S
})

export type Item<S extends ZodSchema> = z.infer<ReturnType<typeof ItemSchema<S>>>

conts ListSchema = <T extends ZodSchema>(S: T) => z.object({
  data: z.array(S)
})

export type List<S extends ZodSchema> = z.infer<ReturnType<typeof ListSchema<S>>
```

このようにして型を定義します。

受け取る際には、

```ts
const list: List<typeof DatumSchema> = ListSchema(DatumSchema).parse(body)
```

という感じになります。

`List`の引数は`Datum`ではなく`typeof DatumSchema`となるのがポイントです。これを忘れてよくコンパイルが失敗します。

# まとめ

Zodの使い方はしっかり覚えよう。
