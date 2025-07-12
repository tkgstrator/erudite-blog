---
title: UGREENのNASで公開鍵認証でSSHが通らない話
date: 2025-06-23
description: パスワード認証、何故
tags: [SSH]
authors: ['tkgstrator']
---

# 背景

UGREENのNASにターミナルを使ってSSHで繋ごうとしたときに、デフォルトはパスワード認証になっていて作成したアカウントのパスワードが求められます。

で、それはいいのですが、それを公開鍵認証に切り替えようとしたらちょっと詰まったので補足しておきます。

## 原因

繋がらない理由はパーミッションです。

最初に設定ファイルを編集してパスワード認証を無効化してもいいのですが、これをやるとセッションを切ったときに設定ファイルに誤りがあると一生繋がらなくなります。

```zsh
chmod 755 "$HOME"
chmod 700 "$HOME/.ssh"
chmod 600 "$HOME/.ssh/authorized_keys"
chown -R "$USER":"$USER" "$HOME/.ssh"
```

多分、こんな感じでいけます。公開鍵認証はディレクトリに777が含まれていたりすると通らなくなるのでそれを修正する感じです。なんでデフォルトでこんなパーミッションになっているのかは謎です。

## 公開鍵設定

サーバー側で以下のコマンドを入力することでGitHubに登録している公開鍵を取ってきて、ログインさせることができるようになります。

```zsh
ssh-import-id gh:tkgstrator
```

## SSH設定

```zsh
PubkeyAuthentication yes
PasswordAuthentication no
```

としてから`sudo systemctl restart sshd`で設定を更新します。このとき、セッションを切らないように注意してください。

最後に、別セッションで公開鍵認証でログインを試みて、成功すればOKです。

# まとめ

多分これがStrapiで書く最後の記事になるんだろうなあって思っています。PayloadCMSとかに乗り換え予定なので。
