---
title: "[Hack] サーモンランで早退・残業できるコード"
date: 2020-04-07
description: サーモンランのWAVE数や時間をする変更コード
tags: [Salmon Run, IPSwitch]
authors: ['tkgstrator']
---

## 早退・残業とは

要するにさっさと帰りたい方やもっともっとバイトしたい方（5.4.0）向けのコード。

### WAVE 数変更コード

```
// Change Wave Count in SR [tkgling]
@disabled
00731430 X0008052
```

X に入れる値を変更すれば効果が変わります。

| X の値 |               効果                |
| :----: | :-------------------------------: |
|   0    | W1 終了後、リザルト画面でフリーズ |
|   2    |           W1 終了後帰還           |
|   4    |           W2 終了後帰還           |
|   6    |           W3 終了後帰還           |
|   8    |  W3 終了後、W4 に突入でフリーズ   |

### WAVE 時間変更コード

```
// Change Wave Total Frame in SR [tkgling]
@disabled
007302A0 XXXXXXXX
```

| XXXXXXXX の値 |  効果  |
| :-----------: | :----: |
|   00008052    |  0 秒  |
|   00778152    | 50 秒  |
|   00EE8252    | 100 秒 |

もっとサーモンランしたい！！っていう方は以下のコードがオススメ。でも下二つは多分やらないほうがいい。

| XXXXXXXX の値 |    効果    |
| :-----------: | :--------: |
|   00658452    |   150 秒   |
|   E0FF9F52    |  1093 秒   |
|   2001A052    |  9831 秒   |
|   4044A0D2    |  165 時間  |
|   0000204A    |  828 日\*  |
|   2033EFD2    | 876 京年\* |

\*がついているやつは動作未確認です。165 時間のやつは多分ちゃんと動きます。

ちなみにガチマッチと違ってどれだけ伸ばしても最大四桁しか表示されないので 9999 秒が最大値となります（それ以上は減ってるように見えないのでわからない）

## 非改造機との通信

WAVE の長さは最初のマッチング時にホストから送られてくるわけではないので、このコードは同期ズレを起こします。

が、ホストが WAVE 終了のデータを送信するのでそれを受け取ることで非改造機もエラー落ちすることなくプレイすることができます。以下にそれぞれの組み合わせでどんな現象が起きるかメモしておきます。

WAVE 数変更コードは致命的な同期ズレを起こすのでゲームが進まなくなります。

### 改造機がホストの場合

| WAVE の長さ |                              非改造機の挙動                              |
| :---------: | :----------------------------------------------------------------------: |
| 100 秒未満  |      ホストが WAVE 終わると同時にクリア <br> 違和感なくプレイできる      |
| 100 秒以上  | 100 秒経った時点で金イクラが消滅 <br> シャケも帰っていくので虚無が訪れる |

### 非改造機がホストの場合

| WAVE の長さ |                                      非改造機の挙動                                      |
| :---------: | :--------------------------------------------------------------------------------------: |
| 100 秒未満  |         自分だけ先に終わり金イクラが消滅 <br> シャケも帰っていくので虚無が訪れる         |
| 100 秒以上  | 100 秒でクリア扱いになるがシャケは帰らない <br> 金イクラも消えないので、次 WAVE で拾える |

結論から言うと、まともに遊べるのは改造機がホストで時間が 100 秒未満のときだけです。なのでめちゃくちゃ長くしてずっとシャケと戯れるっていうのを非改造機と遊ぶことはできません。

記事は以上。
