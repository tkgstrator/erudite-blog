---
title: DockerでMongoDBにレプリカセットを設定する方法
date: 2024-06-26
description: もっと良い方法があると思うのですが、とりあえず忘れないようメモしておきます
tags: [Docker, MongoDB]
authors: ['tkgstrator']
---
git filter-branch -f --env-filter "GIT_AUTHOR_NAME='tkgstrator'; GIT_AUTHOR_EMAIL='nasawake.am@gmail.com'; GIT_COMMITTER_NAME='tkgstrator'; GIT_COMMITTER_EMAIL='nasawake.am@gmail.com';" HEAD
## MongoDB

MongoDBにはレプリカセットという仕組みがあります。

よくわかっていないのですが、一方がぶっ壊れても復旧させるための仕組みっぽいです。

で、ここからがめんどくさいのですが通常MongoDBのイメージをdocker composeで動かせばサービス名でつながるのですがレプリカセットには単純にはそれが反映されないという問題？があるので非常にややこしいです。

あと、ChatGPTがおかしいのかはよくわからないですが訊いても素っ頓狂な答えが返ってきます。

```yaml

```
