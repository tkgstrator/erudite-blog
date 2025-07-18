---
title: BANされる行為とされない行為について
date: 2019-03-29
description: ニンテンドースイッチにおけるBANされる行為とされない行為の基準について
tags: [Nintendo Switch]
authors: ['tkgstrator']
---

## 前提条件

海外 Wiki でも何をどうすれば BAN されるかはまだはっきりとはわかっていないようですが、少なくともぼくは未だに BAN されていないので現在のところは安全とわかっている行為についてメモしていきます。

## オンラインアカウントを使わない

オフラインでの検証しか目的としていないので、ぼくの所持しているニンテンドースイッチは Nintendo Switch Online（以下、NSO）に加入しているアカウントでログインしていません。

こうしておけば間違えて eShop にアクセスする心配もないので、そもそもオンラインアカウントで紐付けないのは結構大事な気がします。

一部のゲームを除き、ほとんどのゲームは NSO に加入していなければオンライン対戦できない（オンラインサーバに繋げない）ので、誤ってオンライン対戦のロビーに接続してしまう危険性もなくなります。

## BAN 確認方法

本体 BAN されるとシステムアップデートおよびゲームアップデートが行えなくなるので、OFW で起動して本体の更新が行えるかどうかチェックしました。

これで検証できるのは FW アップデートすら出来ない本体 BAN（俗に言う SuperBAN）だけのようです。

ゲームだけの BAN はこれでは確かめることができませんが、その場合はゲームアップデートをチェックすることで調べることができます。

## ホーム画面

CFW の状態でインターネット接続すると BAN されるという噂がありますが、それは正しくはないようです。

少なくともホーム画面で普通の動作をしている限りは安全なようです。

### ゲームのアップデート

CFW の状態でも、カートリッジに挿してあるゲームのアップデートは大丈夫なようです。

過去にカートリッジとして挿してプレイしたゲームのアップデートも問題なく行えました。

NSP でインストールしたゲームについても多分大丈夫だと思います。

有効な証明書がないゲームのアップデートは危ないかもしれない。

もちろん OFW ないしは Stock からアップデートを行うほうが安全なので、CFW でアップデートは絶対に行わないようにしましょう。

ただし、NSP については自分でダンプしたものであっても証明書があるかないかなどの問題があり、一概に安全とは言えないかもしれません。

### システムのアップデート

CFW 状態でも BAN されていないと、インターネットに繋がっている限り自動的に最新のシステムアップデートがダウンロードされてしまいます。

それ以前に現在使っている FW が最新のものであるかどうかをインターネット経由でチェックしているはずですが、それも含めてそれらの通信では BAN はされないようです。

### 接続テスト

ニンテンドースイッチの本体からインターネット接続テストを行っても BAN されません。

### コンテンツ情報のダウンロード

インターネットに接続した状態でゲームを起動すると、アカウントが NSO に紐付けられていないものだとしても、

- bcat-list-lp1.cdn.nintendo.net
- bcat-topics-lp1.cdn.nintendo.net

の 2 つの URL にアクセスします。

最新のニュースとゲームのコンテンツに関する情報を取得しているようですが、これらの URL は CFW でアクセスしても問題ないようです。

### アカウントの引っ越し

自分が経験したわけではないのですが、CFW 状態でアカウントの引っ越しを行うと BAN されるようです。

### Nintendo eShop へのアクセス

NSO アカウントで接続しなければいけないので、情報送信時に BAN される可能性が高いと思われます。

紐付けしていなければそもそも起動できない（Nintendo Account との連携を求められる）ので問題ないようです。

## ゲーム

スプラトゥーンくらいしかやっていないので、それについて解説します。

### イカッチャの利用

イカッチャは例え Lan-Play 状態であったとしても通信終了時に任天堂に情報が送られているとの噂がありますが、NSO に連携していなければそもそもインターネットに繋がらないので安全です。

### ロビーに入る

ロビーに入ってもオンライン状態になる前にアカウント紐付けチェックが行われるので、任天堂に情報が送られることはありません。

イカッチャに入ろうとして操作ミスから誤って何度かロビーに入ってしまいましたが、現在のところ特に問題はありません。

### オンラインプレイをする

CFW でオンラインプレイするのは御法度なのですが、LFS も ExeFS も改変していないのであれば BAN されない可能性が高いと思います。

### オンラインでチートを有効化する

ここ二ヶ月間はオンラインでチートしても任天堂のアンチチートシステムが無効化されていたので BAN されなかったらしいです。

ですが、それ以前の問題としてオンラインでチートを使う行為はこれはどう贔屓目に見ても犯罪ですので絶対にやめましょう。

## まとめ

というわけで、現状 BAN されていないぼくの Nintendo Switch で今までやってきたことをメモしてみました。

ただし、ここに書いているからと言って絶対安全とは限りません。

個人的には「NSO のアカウントを認証する段階」でチェックがかかっているような気がするので、オフラインアカウントでもできることは何をやっても BAN されない気がしますね。

というか、アカウントを紐つけていないと「そもそも BAN されたというメールがとどかない」ので、BAN されたかどうかのの確認もめんどくさかったりするのですが。

可能性として、「上記の行為のなかで既に BAN に該当するものがあるが、NSO アカウントと紐付けられていないので BAN されていない」というのが考えられます。

これは、「『BAN しました』という任天堂の通知なしに BAN されることはない」と言い換えることもできます。

仮にそうだとした場合、既にコンソール ID が BAN のフラグを受けていたとしても NSO と紐づけてない限りそれを確認する方法はなく、NSO アカウントを紐つけると（仮にそこから何もしなかったとしても）直ちに本体 BAN を受けるという可能性があります。

これに関しては実際にアカウントを紐つけて BAN される以外に検証のしようがないので確かめられないですね。

いずれにせよ、NSO と紐付けしていなければ見た目上はかなり安全に CFW がつ使用できるようです。

記事は以上。
