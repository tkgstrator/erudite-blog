---
title: バリデーションの書き方で悩む
date: 2025-06-20
description: Zodのバリデーションってたまにわからなくなります
tags: [TypeScript, React, Vercel, React Hook Form]
authors: ['tkgstrator']
---

# 背景

最近、Reactでフォームを弄ることが増えてきたのですが、バリデーションの仕様や、フォーム自体の仕様がよくわかっていないので調べることにしました。

## React Hook Form

これ、実際の挙動がどうなっているかわからなかったので調べてみました。

```ts
export const InputStringTestSchema = z.object({
  string: z.string(),
  string_optional: z.string().optional(),
  string_nullable: z.string().nullable(),
  string_nullish: z.string().nullish(),
  string_nonempty: z.string().nonempty(),
  string_nonempty_optional: z.string().nonempty().optional(),
  string_nonempty_nullable: z.string().nonempty().nullable(),
  string_nonempty_nullish: z.string().nonempty().nullish()
})
export type InputStringTest = z.infer<typeof InputStringTestSchema>
```

まず、このような感じのZodのスキーマを定義します。

| 定義                             | 空文字 | null | undefined |
| -------------------------------- | ------ | ---- | --------- |
| z.string()                       | ✔     |      |           |
| z.string().optional()            | ✔     |      | ✔        |
| z.string().nullable()            | ✔     | ✔   |           |
| z.string().nullish()             | ✔     | ✔   | ✔        |
| z.string().nonempty()            |        |      |           |
| z.string().nonempty().optional() |        |      | ✔        |
| z.string().nonempty().nullable() |        | ✔   |           |
| z.string().nonempty().nullish()  |        | ✔   | ✔        |

これらがどのような値を許容するかということですが、ざっくりと表にすると上のような感じです。

### useFormの初期値

それに対してReactのコンポーネント内で`useForm`を呼び出してデフォルトの状態で何が入っているかを確認してみます。

```ts
const form = useForm<InputTest>({
  resolver: zodResolver(InputTestSchema),
  defaultValues: {}
})
```

何の値が入っているかは`getValues`で取得できるので、それで確認してみたところ、すべての値が`undefined`になっていました。

`defalutValues`は如何なるプロパティでも`undefined`を受け付けるようになっているので、`undefined`は許容しない`z.string()`のプロパティに初期値として`undefined`が代入できてしまう、という違和感が生じます。

といっても、これは仕方がないことで一番丸く収まるのがこの方法だと思います。

### nullableについて

少なくとも、フォームで何かを入力させるのであれば`nullable`は指定する必要がないと思います。というのも、`useForm`ではデフォルトが`undefined`になっているからです。

## エラーメッセージ

Zodではバリデーションを満たさなかった場合に、カスタムでエラーメッセージを出せます。

```ts
z.string().nonempty({ message: '一文字以上入力してください' })
```

と書けば`nonempty`のルールに違反した場合に`message`の内容が表示されます。

で、ここで気になるのは`undefined`だった場合のエラーはどこに書くのか、ということです。`optional`のルールはあるけれど`nonoptional`はないわけですから。

```ts
z.string({ required_error: 'String is required' })
```

その場合は`string()`や`number()`などのプリミティブのルールに対して`required_error`を追加します。これで、そのプロパティが`undefined`の場合のエラーメッセージをカスタマイズできます。ちなみに、何も変更しないと`optional`がついていないにも関わらず`undefined`なプロパティにはRequiredとだけ出力されます。

# UIコンポーネント

フォームの入力値としてどのようなユースケースがあるかを考える必要があるので、実際にUIコンポーネントと連携した場合の挙動について調査します。UIコンポーネントはShadcnを利用しますが、公式ドキュメントによると`Form`と連携できるコンポーネントは、

- Checkbox
- Date Picker
- Input
- Radio Group
- Select
- Switch
- Textarea
- Combobox

のようです。

## Input/Textarea

実際には入力必須かそうでないかの二択になることが多いでしょう。入力必須ではあるけれど、空文字を許可するというのはレアケースだと思います。

`useForm`は指定しなければ初期値として`undefined`が入っていて、一度入力して消したときに空文字が入るという仕様から、

`z.string().nonempty()`とすれば、`undefined`でも空文字ないことが保証されます。入力必須のパラメータにはこれを設定しましょう。

では入力が必須でないパラメータはどうすればいいかというと、`z.string().optional()`でオッケーです。`nonempty`をつけてしまうと、入力値を一回削除したときにバリデーションが通らなくなります。

しかし、よく考えるとこの仕様は若干気持ち悪いです。入力が必須な場合には問題ありませんが、そうでない場合に`z.string().optional()`を設定すると、

- 何も入力しないまま送信する
`undefined`が値に入っており、送信される
- 何かを入力したあと、削除する
空文字が入っており、送信される

という、見た目上は同じに見えるのに、送信されるデータが異なるという状況が発生します。フロント側は最悪それでも良いですが、APIと連携するときに困ります。API側が`z.string().nonempty().optional()`のような`undefined`でもいいけれど空文字は許容しないというバリデーションをつけている場合が往々にしてあるからです。

であれば、このZodの定義はフロント側は通るけれどバックエンドで通らないということになってしまいます。

| フロント                         | z.string().nonempty() | z.string().optional() |
| -------------------------------- | --------------------- | --------------------- |
| z.string()                       | ✔ 空文字             | ✘ undefined          |
| z.string().optional()            | ✔ undefined          | ✔                    |
| z.string().nullable()            | ✔ null               | ✘ undefined          |
| z.string().nullish()             | ✔ undefined/null     | ✔                    |
| z.string().nonempty()            | ✔                    | ✘ undefined, 空文字  |
| z.string().nonempty().optional() | ✔ undefined          | ✘ 空文字             |
| z.string().nonempty().nullable() | ✔ null               | ✘ 空文字             |
| z.string().nonempty().nullish()  | ✔ undefined/null     | ✘ 空文字             |

今回、フロント側では`z.string().nonempty()`と`z.string().optional()`を使う想定なのでそれらだけ列挙しています。対して、バックエンド側はどのバリデーションかはわからないので全パターン用意します。

`z.string().nonempty()`は最も厳しい制約を課しているので、バックエンドがどのような値を受け付ける状況であったとしても問題ありません。ただし、多くの場合において条件が厳しすぎる可能性があります。

例えば、バックエンドが空文字を許容したり`null`を送るべき場合に`z.string().nonempty()`を設定すると厳しすぎて何も送れなくなってしまいます。

逆に`z.string().optional()`は制限がなさすぎて特定の条件下でバックエンドとの不整合が発生します。特に困るのは`z.string().nonempty().optional()`のような`nonempty`属性を付けている場合で、ShadcnのInputのUIコンポーネントが見た目上空っぽなら`undefined`か空文字を送信するという仕様になっているので、バグを生みやすくなっています。

```tsx
<Input
    required={required}
    disabled={disabled}
    placeholder={placeholder}
    {...field}
    {...props}
    onChange={(e) => {
      const value = e.target.value
      field.onChange(value === '' ? undefined : value)
    }}
/>
```

その場合にはこのように`onChange`を制御して空文字の場合に`undefined`に変更するみたいな気配りが必要になります。

これだと常に`undefined`になってしまうので`null`にするような設定もできるようにPropsを変更すると良いと思います。どちらにせよ、空っぽのときに空文字を送信するというのは避けたほうがいいと思います。

## Checkbox

チェックボックスはフロント側では選択されているものを配列として扱うことが多いです。

```ts
{
  abilities: {
    next: true,
    nuxt: true,
    react: false,
    vue: true
  }
}
```

つまりこういう定義にしてしまうと扱うのがめちゃくちゃめんどくさくなります。

```ts
{
  abilities: []
}
```

こっちのほうが使いやすく、Zodのスキーマは、

```ts
const abilities = z.array(z.enum(['next', 'nuxt', 'react', 'vue'])).nonempty()
```

とすればいいです。ここの考え方は文字列のときと同じで、デフォルトでは`undefined`が入っていますが、どれかチェックを入れてから外すと空配列になります。

よって、使うべきチェックボックスの定義は、一つ以上の入力を必須とするのであれば、

```ts
z.array(FrameworkEnum).nonempty()
```

であり、オプションであるならば、

```ts
z.array(FrameworkEnum).optional()
```

となります。また、デフォルトでは初期値が`undefined`であるため、`z.array(FrameworkEnum).nonempty()`をそのまま書くと`Required`のエラーが発生しますが、これは初期値を`[]`にすることで回避できます。

また、`required_error`を変更して、

```ts
z.array(FrameworkEnum, { required_error: 'Array must contain at least 1 element(s)' }).nonempty()
```

このように定義しても良いかもしれません。また、余談ですがZodの定義の時点でデフォルト値を設定することはできません。

```ts
z.array(FrameworkEnum, { required_error: 'Array must contain at least 1 element(s)' }).nonempty().default([])
```

なぜならこの定義は空配列でないことを保証する`nonempty`と`default([])`が矛盾して設定になるからです。個人的には`required_error`のメッセージ内容を無理やり変更してしまうのは良くないと感じているので、入力が必須なのであれば初期値は`[]`を入れるようにするべきかなと思います。それか、少なくとも`nonempty()`と同じエラーメッセージにはならないようにすべきでしょう。

うーん、ますます`nullable`はどこで使うのかわからなくなってきますね......

### Radio Group

入力値にはCheckboxと同じものを使っていますが、やはり初期値は`undefined`なのですが一つも選択していない場合でも`Array must contain at least 1 element(s)`のエラーメッセージが表示されました。Checkboxの場合はここがRequiredだったのでRadio Groupは必ず一つが入力されることが想定されているようです。

なので仕様上は`optional`をつけることはできますが、付ける意味はないと思います。

### Select

これも複数の選択肢から一つを選ばせるものですが、Groupboxと違い配列ではなく単一の値が一つだけ返るので注意が必要です。

また、その時のエラーメッセージは`Required`になります。

### Switch

Booleanなのでtrueかfalseしかとりません。が、初期値は`undefined`になっているのがクセです。

よって、全く操作していない=`undefined`であるならfalseであると認識させる必要があります。

~~もしくは`z.boolean().default(false)`と設定するのも良いです。この設定、一体何に使うのかずっと謎だったのですが`undefined`が入っているときにこの値が代わりに入るみたいです。~~

~~よって`z.boolean().default(false)`としておけば......~~

これやったらそもそも`useForm`のcontrolの型が不一致になったので多分やらないほうがいいです。

となると、`defaultValues`で`true/false`を指定しておくのが多分無難だと思いますが、オブジェクトが巨大になると設定がめんどくさそうだなとも思いました。

### DatePicker

日付を選択するカレンダー的なやつです。

やってみたところ、返り値は`string`ではなく`date`なので、

`z.date()`または`z.date().optional()`で問題ないと思います。

必要であれば例えば現在より一週間後だけ許容するみたいなバリデーションは独自で書いていいと思います。

Shadcnには入力可能なDatePickerと、選択しかできないDatePickerがあるっぽいですが、個人的には選択だけできればいいかなと思っています。

# まとめ

通常の用途として使うべきZodの定義と、どのShadcnのどのUIコンポーネントに利用できるかの表が以下になります。

| 定義                      | Error Message                            | Input/Textarea | Checkbox | Radiobox | Select | Switch | DatePicker |
| ------------------------- | ---------------------------------------- | -------------- | -------- | -------- | ------ | ------ | ---------- |
| z.string().nonempty()     | Required                                 | ✔             |          |          | ✔     |        |            |
| z.string().optional()     |                                          | ✔             |          |          | ✔     |        |            |
| z.array(ZEnum).nonempty() | Array must contain at least 1 element(s) |                | ✔       | ✔       |        |        |            |
| z.array(ZEnum).optional() |                                          |                | ✔       | ✔       |        |        |            |
| z.boolean()               |                                          |                |          |          |        | ✔     |            |
| z.date()                  | Required                                 |                |          |          |        |        | ✔         |
| z.date().optional()       |                                          |                |          |          |        |        | ✔         |

今回のような使い方の場合には`optional()`をつけたプロパティについてはエラーが発生し得ないので、エラーメッセージの部分は空にしてあります。ChatGPTとかにもきいてみましたが、やはり`z.boolean()`は`undefined`を許容しないので`defaultValues`でちゃんと設定して置いたほうが良いです。

もし、`defaultValues`でそれら以外の値も設定するなら文字列も空文字を設定して置いたほうが無難かもしれません。そうすればRequiredのエラーも出ないですし。ただ、`z.boolean()`はともかくとして、`z.date()`でバリデーションをパスする有効な値が初期値として入っているのが違和感があります。設定し忘れしてそのまま送信ボタンを押してしまうと初期値のまま送られてしまうわけですし、入力が必須なプロパティは初期値はバリデーションが通らない値であるべきだと考えています。


