---
title: Stable Diffusion WebUIで外部HDDを利用する
date: 2024-02-05
description: Stable Diffusionで大量の生成データがSSDを圧迫する問題と、外部HDDの活用方法について解説します
tags: [Ubuntu, Stable Diffusion]
authors: ['tkgstrator']
---

## 概要

Stable Diffusionを利用していると大量の生成データでSSDが埋まってしまうことがある。

うちの環境の場合WEBPを使って画像を圧縮しているとはいえ、暖房代わりに一日中生成しているとそれなりのサイズになってしまう。

そこで、外部HDDをマウントして
