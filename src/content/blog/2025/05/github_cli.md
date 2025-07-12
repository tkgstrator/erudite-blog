---
title: Dev ContainerではGitHub CLIを使え
date: 2025-05-12
description: HTTPSの方がSSHより便利なことに気づきました
tags: [TypeScript, GitHub]
authors: ['tkgstrator']
---

# GitHub CLI

いつのことだったか忘れたのですが、GitHubがHTTPSでのプッシュを非サポートにしてSSH限定になったのをきっかけにED25519で鍵を作成して利用するようにしていました。

で、基本的にこれで問題がなかったのですが、最近とある事情からこの利用方法に問題が生じることに......

## アカウント切り替え

GitHubは以前は複数アカウントが禁止されていたような気もするのですが、個人開発アカウントと他の方から依頼されたときに利用するアカウントは分けたいなと思って調べてみたところ、そもそもGitHub自体にアカウントを切り替える機能が搭載されていたので「複数アカウントオッケーになったんだっけ？」と思いながら登録しました。

https://docs.github.com/ja/site-policy/github-terms/github-terms-of-service#b-account-terms

> 調べたらやっぱり建前上はダメみたいでした

そして複数アカウントをしたときに困るのが「同じSSH鍵は別のアカウントに登録できない」ということです。

まあ確かにSSH鍵にはアカウント情報は含まれていないので、GitHubからしたらどっちのアカウントでプッシュするのかわからないからそれはできないというのはわかります。

しかし、どちらのアカウントも利用するホストはgithub.comなのですからこれは困ります。

Dev Containerで開発している場合、今まではホストの`.ssh`をマウントしていたのですが、これではDev Container内でアカウントを切り替えることができずヤキモキしていました。

## GitHub CLI

そんな中、便利だなと思ったのがGitHub CLIです。

ghcr.io/devcontainers/features/github-cli:1

これはもう完全にGitをGitHubで使う前提のツールで、トークンやブラウザ経由での認証を使ってDev Container自体に認証情報を保存できるようになる仕組みです。

これを使えば一回コンテナの中でログインを済ませてしまえば、それ以降は何回立ち上げ直してもそのコンテナで作業しているレポジトリに関してはそのアカウントでログインすることができます。

### コマンド一覧

```zsh
$ gh auth --help
Authenticate gh and git with GitHub

USAGE
  gh auth <command> [flags]

AVAILABLE COMMANDS
  login:         Log in to a GitHub account
  logout:        Log out of a GitHub account
  refresh:       Refresh stored authentication credentials
  setup-git:     Setup git with GitHub CLI
  status:        Display active account and authentication state on each known GitHub host
  switch:        Switch active GitHub account
  token:         Print the authentication token gh uses for a hostname and account

INHERITED FLAGS
  --help   Show help for command

LEARN MORE
  Use `gh <command> <subcommand> --help` for more information about a command.
  Read the manual at https://cli.github.com/manual
  Learn about exit codes using `gh help exit-codes`
  Learn about accessibility experiences using `gh help accessibility`
```

トークンでログインした場合には有効期限がトークンに依存するのでほぼログインしっぱなしで、たまに`switch`を使うかなという感じです。ログイン方法は以下の通り。

```zsh
$ gh auth login
? Where do you use GitHub? GitHub.com
? What is your preferred protocol for Git operations on this host? HTTPS
? Authenticate Git with your GitHub credentials? Yes
? How would you like to authenticate GitHub CLI? Paste an authentication token
Tip: you can generate a Personal Access Token here https://github.com/settings/tokens
The minimum required scopes are 'repo', 'read:org', 'workflow'.
? Paste your authentication token: ****************************************
- gh config set -h github.com git_protocol https
✓ Configured git protocol
! Authentication credentials saved in plain text
✓ Logged in as xxxxxxxx
! You were already logged in to this account
```

とこんな感じで必要な権限があるトークンを発行しておくだけでログインができます。

開発するレポジトリそれぞれに対して毎回これをやるのはちょっと地味にめんどくさいですが、

```zsh
"mounts": ["source=${env:HOME}/.config/gh,target=/home/vscode/.config/gh,type=bind,consistency=cached,readonly"],
```

としてマウントボリュームしておくようにすればホストと共有されるのでまあちょっとだけ手間が楽になります。

# まとめ

GitHub CLIを使い始めてからアカウント切り替えがものすごく楽になったので、今後も重宝していきたいです。
